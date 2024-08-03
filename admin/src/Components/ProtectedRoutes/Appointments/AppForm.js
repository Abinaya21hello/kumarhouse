import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputAdornment,
  Select,
  MenuItem
} from "@mui/material";
import React,{useState,useEffect} from "react";
import { FormLabel } from "react-bootstrap";

const AppForm = ({attend,date,pid,attendchange,dateChange,pidChange}) => {
  
  return (
    <Grid container>
      <Grid item md={5} mb={1} ml={1} mr={1}>
        <FormControl fullWidth>
          <FormLabel>Select Date</FormLabel>
          <TextField fullWidth type="date" value={date} onChange={(e)=>dateChange(e.target.value)}/>
        </FormControl>
      </Grid>
      <Grid item md={5} mb={1} ml={1} mr={1}>
        <FormControl fullWidth>
          <FormLabel>Select Status</FormLabel>
          <Select value={attend} label="Select Attended"  displayEmpty onChange={(e)=>attendchange(e.target.value)}>
            <MenuItem value={null} >Select status</MenuItem>
            <MenuItem value={true} >Attended</MenuItem>
            <MenuItem value={false} >Not Attended</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={5} mb={1} ml={1} mr={1}>
        <FormControl fullWidth>
          <FormLabel>Enter Payment Id</FormLabel>
          <TextField fullWidth  label="Enter Payment Id" value={pid} onChange={(e)=>pidChange(e.target.value)}/>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default AppForm;
