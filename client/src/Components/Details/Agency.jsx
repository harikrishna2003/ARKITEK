import { ColumnDirective, ColumnsDirective, Filter, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Search, Inject, Page, Sort, Edit, Toolbar } from '@syncfusion/ej2-react-grids';
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

function Agency() {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const [data, setData] = useState([]);
    const { projectId } = useParams();

    const getAgencies = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/projects/${projectId}/details/agencies`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
            setData(res.data);
        }
        catch (error) {
            console.error("Error fetching agency data:", error);
        }   
    }

    useEffect(() => {
        getAgencies();
    }, [projectId])

    const actionBegin = async (args) => {
        try {
            if (args.requestType === 'save') {
                if (args.data._id) {
                await axios.put(`http://localhost:3000/projects/${projectId}/details/agencies/${args.data._id}`, args.data,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
                } else {
                await axios.post(`http://localhost:3000/projects/${projectId}/details/agencies`, args.data,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
                }
                getAgencies();
            }

            if (args.requestType === 'delete') {
                const id = args.data[0]._id;
                await axios.delete(`http://localhost:3000/projects/${projectId}/details/agencies/${id}`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
                getAgencies();
            }
        } catch (error) {
            console.error('Action failed:', error);
        }   
    };
    
    const pageSettings = { pageSize: 5 };
    const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    
    if (role ==="admin") {
        var  toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
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
            dialog.header = args.requestType === 'beginEdit' ? 'Edit Record of ' + args.rowData['Agency'] : 'New Agency';
        }
    }

    return <GridComponent dataSource={data} actionBegin={actionBegin} actionComplete={actionComplete} allowPaging={true} editSettings={editOptions} toolbar={toolbarOptions} pageSettings={pageSettings} allowSorting={true}>
        <ColumnsDirective>
            <ColumnDirective field='agency' width='75' textAlign='Left'/>
            <ColumnDirective field='owner' width='75' textAlign='Left'/>
            <ColumnDirective field='address' width='100' textAlign='Left'/>
            <ColumnDirective field='contact' width='75' textAlign='Left'/>
            <ColumnDirective field='location' width='100' textAlign='Left'/>
            <ColumnDirective field='expenditure' width='60' textAlign='Left'/>
        </ColumnsDirective>
        <Inject services={[Page, Sort, Group, Toolbar, Edit, Search]}/>
    </GridComponent>;
}
;
export default Agency;