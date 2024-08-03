import React from "react";
import { Button, Grid, MenuItem, Select, Typography } from "@mui/material";

const Form = ({ vacancies, value, onChange, onClick }) => {
  return (
    <Grid container spacing={2} pt={4} pl={2} pr={2} pb={4}>
      <Grid item md={6}>
        <Select fullWidth value={value} onChange={onChange} displayEmpty>
          <MenuItem value="" disabled>
            Select a vacancy
          </MenuItem>
          {vacancies &&
            vacancies.map((data) => (
              <MenuItem key={data._id} value={data._id}>
                {data.title}
              </MenuItem>
            ))}
        </Select>
      </Grid>
      <Grid item md={6}>
        <Button
          fullWidth
          variant="contained"
          sx={{ height: "100%" }}
          onClick={onClick}
          disableTouchRipple
          disabled={value!=""?false:true}
        >
          <Typography>Filter</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Form;
