import Event from '../models/Event.js';
import mongoose from 'mongoose';

export const createEvent = async (req, res) => {
  try {
    const { subject, startTime, endTime, isAllDay, location, description, recurrenceId, recurrenceRule } = req.body;
    const projectId = req.params.projectId;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Basic validation
    if (!subject || !startTime || !endTime) {
      return res.status(400).json({ message: 'Subject, startTime, and endTime are required' });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const event = new Event({
      subject,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isAllDay: isAllDay || false,
      location,
      description,
      recurrenceRule,
      recurrenceId,
      project: projectId,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ 
      message: err.message.includes('validation') 
        ? 'Validation error: ' + err.message 
        : 'Internal Server Error' 
    });
  }
};

export const getAllEventsForProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const events = await Event.find({ project: projectId })
      .sort({ startTime: 1 })
      .lean();

    console.log(`✅ Found ${events.length} events for project ${projectId}`);
    res.status(200).json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const projectId = req.params.projectId;
    const updates = req.body;

    // 🐛 DEBUG: Log all the details
    console.log('=== UPDATE EVENT DEBUG ===');
    console.log('Event ID from params:', eventId);
    console.log('Event ID type:', typeof eventId);
    console.log('Event ID length:', eventId?.length);
    console.log('Project ID:', projectId);
    console.log('Updates:', updates);
    console.log('Is valid ObjectId?', mongoose.Types.ObjectId.isValid(eventId));
    console.log('========================');

    if (!eventId) {
      console.error('❌ No event ID provided');
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.error('❌ Invalid event ID format:', eventId);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    // Validate time if both are being updated
    if (updates.startTime && updates.endTime) {
      if (new Date(updates.startTime) >= new Date(updates.endTime)) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }
    }

    console.log('🔍 Searching for event with ID:', eventId);
    
    // First, let's check if the event exists
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      console.error('❌ Event not found with ID:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('✅ Found existing event:', existingEvent);

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updates,
      { new: true, runValidators: true }
    );

    console.log('✅ Successfully updated event:', updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    res.status(500).json({ 
      message: error.message.includes('validation') 
        ? 'Validation error: ' + error.message 
        : 'Failed to update event' 
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const projectId = req.params.projectId;

    // 🐛 DEBUG: Log all the details
    console.log('=== DELETE EVENT DEBUG ===');
    console.log('Event ID from params:', eventId);
    console.log('Event ID type:', typeof eventId);
    console.log('Event ID length:', eventId?.length);
    console.log('Project ID:', projectId);
    console.log('Is valid ObjectId?', mongoose.Types.ObjectId.isValid(eventId));
    console.log('========================');

    if (!eventId) {
      console.error('❌ No event ID provided');
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.error('❌ Invalid event ID format:', eventId);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    console.log('🔍 Searching for event with ID:', eventId);
    
    // First, let's check if the event exists
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      console.error('❌ Event not found with ID:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('✅ Found existing event:', existingEvent);

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    console.log('✅ Successfully deleted event');
    
    res.status(204).send();
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};