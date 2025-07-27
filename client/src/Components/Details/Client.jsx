import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Edit, Inject, Page, Search, Sort, Toolbar } from '@syncfusion/ej2-react-grids';
import { L10n } from '@syncfusion/ej2-base';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

L10n.load({
    'en-US': {
        grid: {
            'SaveButton': 'Save',
            'CancelButton': 'Cancel'
        }
    }
});



function Client() {
    const [data, setData] = useState([]);
    const { projectId } = useParams();
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    const getClients = async () => {
        try{
            const res = await axios.get(`http://localhost:3000/projects/${projectId}/details/clients`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
            setData(res.data);
        }
        catch (error) {
            console.error("Error fetching client data:", error);
        }
    }

    useEffect(() => {
        getClients();
    }, [projectId])

    const actionBegin = async (args) => {
        try {
            if (args.requestType === 'save') {
                if (args.data._id) {
                await axios.put(`http://localhost:3000/projects/${projectId}/details/clients/${args.data._id}`, args.data,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
                } else {
                await axios.post(`http://localhost:3000/projects/${projectId}/details/clients`, args.data,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
                }
                getClients();
            }

            if (args.requestType === 'delete') {
                const id = args.data[0]._id;
                await axios.delete(`http://localhost:3000/projects/${projectId}/details/clients/${id}`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
                getClients();
            }
        } catch (error) {
            console.error('Action failed:', error);
        }   
    }
    const pageSettings = { pageSize: 5 };
    const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, showConfirmDialog: false, mode: 'Dialog'  };
    
    if ( role === "admin"){
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
            dialog.header = args.requestType === 'beginEdit' ? 'Edit Record of ' + args.rowData['Client'] : 'New Client';
        }
    }

    return <GridComponent dataSource={data} actionBegin={actionBegin} actionComplete={actionComplete} allowPaging={true} editSettings={editOptions} toolbar={toolbarOptions} pageSettings={pageSettings} allowSorting={true}>
        <ColumnsDirective>
            <ColumnDirective field='Name' width='75' textAlign="Left"/>
            <ColumnDirective field='Client Name' width='75' textAlign='Left'/>
            <ColumnDirective field='Address' width='100' textAlign="Left"/>
            <ColumnDirective field='Contact' width='75' textAlign="Left"/>
            <ColumnDirective field='Site Manager' width='75' textAlign="Left"/>
            <ColumnDirective field='Location' width='100' textAlign='Left'/>
            <ColumnDirective field='Earning' width='60' textAlign='Left'/>
        </ColumnsDirective>
        <Inject services={[Page, Sort, Group, Edit,Toolbar, Search]}/>
    </GridComponent>;
}
;
export default Client;