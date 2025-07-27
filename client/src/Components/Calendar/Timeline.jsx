import React, { useEffect, useState } from 'react';
import {
  ScheduleComponent,
  Day,
  Week,
  Agenda,
  Month,
  Inject,
  ViewsDirective,
  ViewDirective
} from '@syncfusion/ej2-react-schedule';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Timeline() {
  const [events, setEvents] = useState([]);
  const [eventIdMap, setEventIdMap] = useState(new Map()); // Map Syncfusion GUIDs to MongoDB IDs
  const { projectId } = useParams();

  const token = localStorage.getItem("token")

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/projects/${projectId}/events`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      const formattedEvents = response.data.map(event => ({
        Id: event._id, // Use the actual MongoDB ID
        Subject: event.subject,
        StartTime: new Date(event.startTime),
        EndTime: new Date(event.endTime),
        IsAllDay: event.isAllDay,
        Location: event.location,
        Description: event.description,
        RecurrenceRule: event.recurrenceRule,
        RecurrenceID: event.recurrenceId,
        RecurrenceException: event.recurrenceException,
        ProjectId: event.project,
        // Store the original MongoDB ID for reference
        OriginalId: event._id
      }));
      
      // Create a mapping of all event IDs (both original and any GUIDs Syncfusion might create)
      const idMap = new Map();
      response.data.forEach(event => {
        idMap.set(event._id, event._id); // Map MongoDB ID to itself
      });
      setEventIdMap(idMap);
      
      console.log('Formatted events:', formattedEvents);
      console.log('Event ID Map:', idMap);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (projectId) fetchEvents();
  }, [projectId]);

  const handleActionBegin = async (args) => {
    console.log('=== ACTION BEGIN ===');
    console.log('Request Type:', args.requestType);
    console.log('Args:', args);
    
    if (
      args.requestType === 'eventCreate' ||
      args.requestType === 'eventChange' ||
      args.requestType === 'eventRemove'
    ) {
      // Don't cancel - let Syncfusion handle the UI, we'll sync with backend
      const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
      
      console.log('Event Data:', eventData);
      console.log('Event Data Keys:', Object.keys(eventData || {}));

      try {
        if (args.requestType === 'eventCreate') {
          console.log('🆕 Processing eventCreate request');
          
          // Check if this is actually an update disguised as a create
          // This can happen when Syncfusion generates new GUIDs during drag/resize operations
          let eventId = eventData?.Id || eventData?.id;
          const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
          
          // Look for an existing event that might match this "new" event
          let existingEvent = null;
          
          // Method 1: Check if the ID is already a MongoDB ObjectId (shouldn't happen in create, but let's check)
          if (mongoIdRegex.test(eventId)) {
            existingEvent = events.find(e => e.Id === eventId);
            if (existingEvent) {
              console.log('🔄 EventCreate with valid MongoDB ID - converting to update');
            }
          }
          
          // Method 2: Check if we have an event with the same subject and original start time
          if (!existingEvent && eventData.Subject) {
            // Look for events with same subject that might be getting updated
            const potentialMatches = events.filter(e => 
              e.Subject === eventData.Subject &&
              Math.abs(new Date(e.StartTime).getTime() - new Date(eventData.StartTime).getTime()) < 60000 // Within 1 minute
            );
            
            if (potentialMatches.length === 1) {
              existingEvent = potentialMatches[0];
              console.log('🔄 Found potential match by subject and time - converting to update');
            }
          }
          
          // Method 3: Check if this looks like a time update operation
          // If we have very similar events (same subject, close times), it's likely an update
          if (!existingEvent && eventData.Subject && events.length > 0) {
            const similarEvent = events.find(e => 
              e.Subject === eventData.Subject &&
              (e.Location === eventData.Location || (!e.Location && !eventData.Location)) &&
              (e.Description === eventData.Description || (!e.Description && !eventData.Description))
            );
            
            if (similarEvent) {
              console.log('🔄 Found similar event - likely a time update, converting to update');
              existingEvent = similarEvent;
            }
          }
          
          if (existingEvent) {
            // This is actually an update, not a create
            console.log('✏️ Converting eventCreate to eventChange for existing event:', existingEvent.Id);
            
            const updateResponse = await axios.put(`http://localhost:3000/projects/${projectId}/events/${existingEvent.Id}`, {
              subject: eventData.Subject,
              startTime: eventData.StartTime,
              endTime: eventData.EndTime,
              isAllDay: eventData.IsAllDay || false,
              location: eventData.Location || '',
              description: eventData.Description || '',
              recurrenceRule: eventData.RecurrenceRule,
              recurrenceId: eventData.RecurrenceID
            },
            {
              headers: {
                Authorization:`Bearer ${token}`,
                'Content-Type':'application/json'
              }
            });
            
            // Update the event ID to maintain consistency
            eventData.Id = existingEvent.Id;
            
            console.log('✅ Updated existing event (via eventCreate) with ID:', existingEvent.Id);
            return;
          }
          
          // If we get here, it's genuinely a new event
          console.log('🆕 Creating genuinely new event');
          
          const response = await axios.post(`http://localhost:3000/projects/${projectId}/events`, {
            subject: eventData.Subject,
            startTime: eventData.StartTime,
            endTime: eventData.EndTime,
            isAllDay: eventData.IsAllDay || false,
            location: eventData.Location || '',
            description: eventData.Description || '',
            recurrenceRule: eventData.RecurrenceRule,
            recurrenceId: eventData.RecurrenceID
          },
          {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        
          
          // Update the event with the new ID from backend
          eventData.Id = response.data._id;
          
          // Update our ID mapping
          setEventIdMap(prev => new Map(prev.set(response.data._id, response.data._id)));
          
          console.log('✅ Created new event with ID:', response.data._id);
          
        } else if (args.requestType === 'eventChange') {
          // Get the correct ID for updates
          let eventId = eventData?.Id || eventData?.id;
          let actualMongoId = null;
          
          console.log('Original Event ID from Syncfusion:', eventId);
          console.log('Events array length:', events.length);
          console.log('EventIdMap size:', eventIdMap.size);
          
          // Check if this is actually a new event that Syncfusion is treating as an update
          // This can happen when the events array is empty or the event doesn't exist in our data
          const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
          const isValidMongoId = mongoIdRegex.test(eventId);
          const eventExistsInData = events.some(e => e.Id === eventId);
          
          // If we have no events or the event doesn't exist in our data and it's not a valid MongoDB ID,
          // this might be a new event that should be created instead
          if (events.length === 0 || (!eventExistsInData && !isValidMongoId)) {
            console.log('🔄 Converting eventChange to eventCreate - this appears to be a new event');
            
            // Create the event instead of updating
            const response = await axios.post(`http://localhost:3000/projects/${projectId}/events`, {
              subject: eventData.Subject,
              startTime: eventData.StartTime,
              endTime: eventData.EndTime,
              isAllDay: eventData.IsAllDay || false,
              location: eventData.Location || '',
              description: eventData.Description || '',
              recurrenceRule: eventData.RecurrenceRule,
              recurrenceId: eventData.RecurrenceID
            },{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
          });
            
            // Update the event with the new ID from backend
            eventData.Id = response.data._id;
            
            // Update our ID mapping
            setEventIdMap(prev => new Map(prev.set(response.data._id, response.data._id)));
            
            console.log('✅ Created event (via eventChange) with ID:', response.data._id);
            return;
          }
          
          // For recurring events, Syncfusion generates GUIDs, we need to find the original MongoDB ID
          if (eventData?.RecurrenceID) {
            // This is a recurring event occurrence, use the RecurrenceID (should be the original event's MongoDB ID)
            actualMongoId = eventData.RecurrenceID;
            console.log('📅 Recurring event - using RecurrenceID:', actualMongoId);
          } else if (eventIdMap.has(eventId)) {
            // We have a mapping for this ID
            actualMongoId = eventIdMap.get(eventId);
            console.log('🗺️ Found ID in map:', actualMongoId);
          } else if (isValidMongoId) {
            actualMongoId = eventId;
            console.log('✅ Event ID is already a valid MongoDB ObjectId');
          } else {
            // This is likely a Syncfusion GUID for a recurring event occurrence
            // We need to find the original event by checking all events
            const originalEvent = events.find(e => 
              e.RecurrenceRule && // It's a recurring event
              (e.Id === eventData?.RecurrenceID || // Direct match with RecurrenceID
               e.Subject === eventData?.Subject) // Fallback: match by subject (not ideal but might work)
            );
            
            if (originalEvent) {
              actualMongoId = originalEvent.Id;
              console.log('🔍 Found original recurring event ID:', actualMongoId);
              // Update our mapping for future use
              setEventIdMap(prev => new Map(prev.set(eventId, actualMongoId)));
            } else {
              console.error('❌ Could not find original MongoDB ID for event');
              console.error('Available events:', events.map(e => ({ Id: e.Id, Subject: e.Subject, RecurrenceRule: e.RecurrenceRule })));
              args.cancel = true;
              return;
            }
          }
          
          if (!actualMongoId) {
            console.error('❌ No valid MongoDB ID found for update');
            args.cancel = true;
            return;
          }
          
          console.log('🎯 Final MongoDB ID to use:', actualMongoId);
          console.log('✏️ Updating event with MongoDB ID:', actualMongoId);
          
          const updateResponse = await axios.put(`http://localhost:3000/projects/${projectId}/events/${actualMongoId}`, {
            subject: eventData.Subject,
            startTime: eventData.StartTime,
            endTime: eventData.EndTime,
            isAllDay: eventData.IsAllDay || false,
            location: eventData.Location || '',
            description: eventData.Description || '',
            recurrenceRule: eventData.RecurrenceRule,
            recurrenceId: eventData.RecurrenceID
          },{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
          console.log('✅ Updated event - Response:', updateResponse.data);
          
        } else if (args.requestType === 'eventRemove') {
          let eventId = eventData?.Id || eventData?.id;
          
          console.log('🗑️ DELETE - Event ID from Syncfusion:', eventId);
          console.log('🗑️ DELETE - Event Data:', eventData);
          console.log('🗑️ DELETE - Events array length:', events.length);
          console.log('🗑️ DELETE - EventIdMap size:', eventIdMap.size);
          
          if (!eventId) {
            console.error('❌ No event ID found for delete');
            args.cancel = true;
            return;
          }
          
          // For delete, we need to find the actual MongoDB ID
          let actualMongoId = null;
          const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
          
          // First, check if the ID is already a valid MongoDB ObjectId
          if (mongoIdRegex.test(eventId)) {
            actualMongoId = eventId;
            console.log('✅ Event ID is already a valid MongoDB ObjectId');
          } 
          // Check if we have a mapping for this ID
          else if (eventIdMap.has(eventId)) {
            actualMongoId = eventIdMap.get(eventId);
            console.log('🗺️ Found ID in map:', actualMongoId);
          } 
          // Try to find the event in our current events array
          else {
            const foundEvent = events.find(e => e.Id === eventId || e.OriginalId === eventId);
            if (foundEvent) {
              actualMongoId = foundEvent.Id || foundEvent.OriginalId;
              console.log('🔍 Found event in events array:', actualMongoId);
            } else {
              // Last resort: if it's a GUID, try to find by other properties
              const eventBySubject = events.find(e => 
                e.Subject === eventData?.Subject && 
                e.StartTime?.getTime() === eventData?.StartTime?.getTime()
              );
              if (eventBySubject) {
                actualMongoId = eventBySubject.Id;
                console.log('🔍 Found event by subject and time:', actualMongoId);
              }
            }
          }
          
          if (!actualMongoId) {
            console.error('❌ Could not find MongoDB ID for delete');
            console.error('Available events:', events.map(e => ({ 
              Id: e.Id, 
              Subject: e.Subject, 
              StartTime: e.StartTime 
            })));
            args.cancel = true;
            return;
          }
          
          console.log('🎯 Final MongoDB ID to delete:', actualMongoId);
          
          const deleteResponse = await axios.delete(`http://localhost:3000/projects/${projectId}/events/${actualMongoId}`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
          console.log('✅ Deleted event - Response status:', deleteResponse.status);
          
          // Remove from our ID mapping
          setEventIdMap(prev => {
            const newMap = new Map(prev);
            newMap.delete(eventId);
            newMap.delete(actualMongoId);
            return newMap;
          });
        }
        
      } catch (error) {
        console.error('❌ Backend operation failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method
        });
        // If backend fails, cancel the UI change
        args.cancel = true;
      }
    }
  };

  const handleActionComplete = (args) => {
    console.log('=== ACTION COMPLETE ===');
    console.log('Request Type:', args.requestType);
    
    // Refresh data after any change to ensure sync
    if (
      args.requestType === 'eventCreate' ||
      args.requestType === 'eventChange' ||
      args.requestType === 'eventRemove'
    ) {
      setTimeout(() => {
        console.log('🔄 Refreshing events after UI update');
        fetchEvents();
      }, 100);
    }
  };

  return (
    <ScheduleComponent
      ref={ref => { if (ref) console.log('Schedule component ref:', ref); }}
      width="100%"
      height="100vh"
      currentView="Month"
      selectedDate={new Date()}
      eventSettings={{
        dataSource: events
      }}
      actionBegin={handleActionBegin}
      actionComplete={handleActionComplete}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
        <ViewDirective option="Agenda" />
      </ViewsDirective>
      <Inject services={[Day, Week, Agenda, Month]} />
    </ScheduleComponent>
  );
}

export default Timeline;