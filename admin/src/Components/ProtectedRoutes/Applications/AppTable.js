import React from "react";
import "./table.css";
import { Button, Typography } from "@mui/material";

const AppTable = ({applications,deleteApp}) => {
  return (
    <table>
      <tr>
        <th>S.no</th>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Resume</th>
        <th>Delete</th>
      </tr>
   {applications && applications.map((data,index)=>(
       <tr key={data._id}>
       <td>{index+1}</td>
       <td>{data.name}</td>
       <td>{data.email}</td>
       <td>{data.mobile}</td>
       <td><a href={data.resume.url} target="blank">{data.resume.pid.split("/")[1]}</a></td>
       <td>
         <Button color="error" onClick={()=>deleteApp(data._id,data.resume.pid.split("/")[1])} >
           <Typography>Delete</Typography>
         </Button>
       </td>
     </tr>
   ))}
    </table>
  );
};

export default AppTable;
