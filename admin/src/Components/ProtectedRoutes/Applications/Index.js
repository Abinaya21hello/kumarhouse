import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Form from "./Form";
import AppTable from "./AppTable";
import Pagination from "../Appointments/Pagination";
import { client } from "../../clientaxios/Clientaxios";

const Index = () => {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [application, setApplication] = useState();
  const [filteredApplication, setFilteredApplication] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(1);

  const handleChange = (e) => {
    setSelectedVacancy(e.target.value);
  };

  const getDatas = async () => {
    let response;
    try {
      response = await client.get("/vacancy");
    } catch (err) {
      console.log(err);
    }
    if (response.status != 200) {
      console.log("err");
    } else {
      setVacancies(response.data);
    }
  };

  const getVacancybyId = async () => {
    let vacancy;
    try {
      vacancy = await client.get(`/vacancy/${selectedVacancy}`);
    } catch (err) {
      console.log(err);
    }
    if (vacancy.status != 200) {
      console.log("error");
    } else {
      console.log(vacancy.data);
      setApplication(vacancy.data);
      filter(vacancy.data.application, 1);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const filter = (list, no) => {
    const limit = singlepage(list);
    console.log(limit);
    const filtered = list.slice(limit * (no - 1), limit * no);
    setFilteredApplication(filtered);
  };

  const changePageNo = (e) => {
    setPageNo(e.target.value);
    filter(application.application, e.target.value);
  };

  const singlepage = (list) => {
    if (list.length > 5) {
      setTotal(list.length / 5);
      return 5;
    } else {
      setTotal(1);
      return list.length;
    }
  };

  const deleteApp = async (id,pid) => {
    let response;
    try {
      response = await client.delete(`/application/${id}/${pid}`);
    } catch (err) {
      console.log();
    }
    if (response.status != 200) {
      console.log("error");
    } else {
      getVacancybyId();
    }
  };

  const removeFromVac = async (id,pid) => {
    let response;
    try {
      response = await client.put(`/vacancy/application/${application._id}`, { id: id });
    } catch (err) {
      console.log(err);
    }
    if (response.status != 200) {
      console.log("err");
    } else {
      deleteApp(id,pid);
    }
  };

  const handleDelete = (id, pid) => {
    removeFromVac(id,pid);
  };

  return (
    <Box>
      <Typography variant="h4">Applications</Typography>
      <Form
        vacancies={vacancies}
        value={selectedVacancy}
        onChange={handleChange}
        onClick={getVacancybyId}
      />
      {application ? (
        <>
          <AppTable applications={filteredApplication} deleteApp={(id,pid)=>handleDelete(id,pid)}/>
          <Pagination value={pageNo} onChange={changePageNo} total={total} />
        </>
      ) : (
        <Typography variant="h6" pl={3}>
          Select a vacancy and press filter to view its applications
        </Typography>
      )}
    </Box>
  );
};

export default Index;
