import { ColumnDirective, ColumnsDirective, Filter, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Search, Inject, Page, Sort, Edit, Toolbar } from '@syncfusion/ej2-react-grids';
import { DatePicker, DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { L10n } from '@syncfusion/ej2-base';
// import { data } from './scheduledata';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

L10n.load({
    'en-US': {
        grid: {
            'SaveButton': 'Save',
            'CancelButton': 'Cancel'
        }
    }
});

function ScheduleTable() {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
    const [data, setData] = useState([]);
    const { projectId } = useParams();

    const fetchMeetings = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/projects/${projectId}/schedule`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
            setData(res.data);
        }
        catch (error) {
            console.error("Error fetching schedule data:", error);
        }
    }

    useEffect(() => {
        fetchMeetings();
    }, [projectId]);

    const actionBegin = async (args) => {
        try {
        if (args.requestType === 'save') {
            if (args.data._id) {
            await axios.put(`http://localhost:3000/projects/${projectId}/schedule/${args.data._id}`, args.data);
            } else {
            await axios.post(`http://localhost:3000/projects/${projectId}/schedule`, args.data);
            }
            fetchMeetings();
        }

        if (args.requestType === 'delete') {
            const id = args.data[0]._id;
            await axios.delete(`http://localhost:3000/projects/${projectId}/schedule/${id}`);
            fetchMeetings();
        }
        } catch (error) {
        console.error('Action failed:', error);
        }   
    };
    const pageSettings = { pageSize: 5 };
    const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    
    if (role === "admin") {
      var toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
    }
    else {
      var toolbarOptions = ['Search'];
    }
    const actionComplete = (args) => {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            const dialog = args.dialog;
            dialog.showCloseIcon = false;
            dialog.height = 600;
            dialog.width = 500;
            // change the header of the dialog
            dialog.header = args.requestType === 'beginEdit' ? 'Edit schedule' : 'New Schedule';
        }
    }

   return (
    <GridComponent
      dataSource={data}
      actionBegin={actionBegin}
      actionComplete={actionComplete}
      allowPaging={true}
      editSettings={editOptions}
      toolbar={toolbarOptions}
      pageSettings={pageSettings}
      allowSorting={true}
    >
      <ColumnsDirective>
        <ColumnDirective field="name" headerText="Name" width="100" textAlign="Left" />
        <ColumnDirective field="email" headerText="Email" width="100" textAlign="Left" />
        <ColumnDirective
          field="date"
          headerText="Date"
          width="90"
          textAlign="Left"
          edit={{
            create: () => document.createElement('input'),
            read: (args) => args.value,
            destroy: () => {},
            write: (args) => {
              const label = document.createElement('label');
              label.innerText = 'Date';
              label.style.display = 'block';
              label.style.marginBottom = '4px';
              args.element.parentNode.insertBefore(label, args.element);

              new DatePickerComponent({
                value: args.rowData?.date || null,
                placeholder: 'Select date'
              }).appendTo(args.element);
            }
          }}
        />
        <ColumnDirective
          field="time"
          headerText="Time"
          width="90"
          textAlign="Left"
          edit={{
            create: () => document.createElement('input'),
            read: (args) => args.value,
            destroy: () => {},
            write: (args) => {
              const label = document.createElement('label');
              label.innerText = 'Time';
              label.style.display = 'block';
              label.style.marginBottom = '4px';
              args.element.parentNode.insertBefore(label, args.element);

              new TimePickerComponent({
                value: args.rowData?.time || null,
                placeholder: 'Select time'
              }).appendTo(args.element);
            }
          }}
        />
        <ColumnDirective field="agenda" headerText="Agenda" width="100" textAlign="Left" />
        <ColumnDirective field="remarks" headerText="Remarks" width="100" textAlign="Left" />
      </ColumnsDirective>
      <Inject services={[Page, Sort, Toolbar, Edit, Search]} />
    </GridComponent>
  );
}

export default ScheduleTable;