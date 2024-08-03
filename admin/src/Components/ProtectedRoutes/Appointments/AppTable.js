import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./TableCss.css";
import Pagination from "./Pagination";

const AppTable = ({ appointments, deleteApp, attend, editAppoint }) => {
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [current, setCurrent] = useState(1);
  const [transindex, setTransIndex] = useState();
  const [date, setDate] = useState("");

  const findSinglepage = () => {
    if (appointments.length > 5) {
      return 5;
    } else {
      return appointments.length;
    }
  };

  const filtering = () => {
    let singlepage = findSinglepage();
    const filtered = appointments.slice(
      (current - 1) * singlepage,
      current * singlepage
    );
    setFilteredAppointments(filtered);
  };

  const handleSave = (item) => {
    console.log(item);
    if (date) {
      editAppoint({ id: item._id, date: date,email:item.email });
      setTransIndex("");
    } else {
      editAppoint({ id: item._id, date: item.rawDate,email:item.email });
      setTransIndex("");
    }
  };

  useEffect(() => {
    filtering();
  }, [appointments, current]);
  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        paddingBottom: "25px",
      }}
    >
      <table>
        <tr>
          <th style={{ width: "50px" }}>S.no</th>
          <th style={{ width: "160px" }}>Name</th>
          <th style={{ width: "160px" }}>Email</th>
          <th style={{ width: "160px" }}>Mobile</th>
          <th style={{ width: "160px" }}>Appointment Date</th>
          <th style={{ width: "210px" }}>Resume</th>
          <th style={{ width: "210px" }}>Attend</th>
          <th style={{ width: "70px" }}>Edit</th>
          <th style={{ width: "70px" }}>Delete</th>
        </tr>
        {filteredAppointments &&
          filteredAppointments.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.mobile}</td>
              <td>
                {index === transindex ? (
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                ) : (
                  data.rawDate
                )}
              </td>
              <td>
                <a href={data.resume.url} target="blank">
                  {data.resume.pid.split("/")[1]}
                </a>
              </td>
              <td>
                <Button
                  color={data.attended ? "inherit" : "success"}
                  disabled={data.attended ? true : false}
                  onClick={() => attend(data._id)}
                >
                  Attend
                </Button>
              </td>
              <td>
                {index === transindex ? (
                  <Button color="success" onClick={() => handleSave(data)}>
                    Save
                  </Button>
                ) : (
                  <Button color="warning" onClick={() => setTransIndex(index)}>
                    Edit
                  </Button>
                )}
              </td>
              <td>
                <Button color="error" onClick={() => deleteApp(data._id,data.resume.pid.split("/")[1])}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </table>
      <div style={{ width: "100%", marginTop: "25px", marginBottom: "25px" }}>
        <Pagination
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          total={appointments.length / findSinglepage()}
        />
      </div>
    </div>
  );
};

export default AppTable;
