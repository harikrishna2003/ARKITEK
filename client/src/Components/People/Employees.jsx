import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Inject, Page, Sort } from '@syncfusion/ej2-react-grids';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Toolbar } from '@syncfusion/ej2-react-grids'; // ✅ already imported, just ensure it's included in Inject



function Employees() {
  const token = localStorage.getItem("token")
  const { projectId } = useParams();
  const [participants, setParticipants] = useState([]);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/projects/${projectId}/participants`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      setParticipants(res.data);
    } catch (err) {
      console.error("Error fetching project participants:", err);
    }
  };

  useEffect(() => {
    if (projectId) fetchParticipants();
  }, [projectId]);

  const pageSettings = { pageSize: 10 };

  const actionComplete = (args) => {
    if (args.requestType === "searching" && args.searchString === "") {
        // When search is cleared, re-fetch all data
            fetchParticipants();
        }
    };


  return (
    <GridComponent
        dataSource={participants}
        allowPaging={true}
        actionComplete={actionComplete}
        pageSettings={pageSettings}
        allowSorting={true}
        toolbar={['Search']} // ✅ REQUIRED to show search input
    >

      <ColumnsDirective>
        <ColumnDirective field="email" headerText="Email" width="120" />
        <ColumnDirective
          field="firstName"
          headerText="Name"
          width="120"
          textAlign="Left"
          template={(data) => `${data.firstName} ${data.lastName}`}
        />
        <ColumnDirective field="jobProfile" headerText="Job Profile" width="120" textAlign="Left" />
      </ColumnsDirective>
      <Inject services={[Page, Sort, Group, Toolbar]} />
    </GridComponent>
  );
}
export default Employees;