import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

const Topnav = () => {
  const [topNavItems, setTopNavItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null); // For delete confirmation
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTopNavItems();
  }, []);

  const fetchTopNavItems = async () => {
    try {
      const response = await axiosInstance.get("api/gettopnav", {
        withCredentials: true,
      });
      console.log("API Response:", response.data); // Log the response to check its structure
      setTopNavItems(response.data);
    } catch (err) {
      console.error("Error fetching top nav items:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const trimmedData = {
        title: data.title.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        mobileNo: data.mobileNo.trim(),
        addresses: [{
          street: data.street.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          country: data.country.trim(),
          pincode: data.pincode.trim(),
        }],
      };
  
      if (editItem) {
        await axiosInstance.put(
          `/api/topnav/${editItem._id}`,
          trimmedData,
          { withCredentials: true }
        );
        toast.success("Top nav item updated successfully!");
      } else {
        await axiosInstance.post(
          "/api/topnav",
          trimmedData,
          { withCredentials: true }
        );
        toast.success("Top nav item added successfully!");
      }
      fetchTopNavItems();
      reset();
      setEditItem(null);
    } catch (err) {
      console.error("Error saving top nav item:", err.response ? err.response.data : err.message);
      
      if (err.response && err.response.data && err.response.data.errors) {
        // If the server returned specific errors, display them
        const errors = err.response.data.errors;
        toast.error(errors[0]); // Display the first error message
      } else {
        // Otherwise, display a generic error message
        toast.error("Failed to save top nav item!");
      }
    }
  };
  

  const handleEdit = (item) => {
    setEditItem(item);
    setValue("title", item.title);
    setValue("phone", item.phone);
    setValue("email", item.email);
    setValue("mobileNo", item.mobileNo);
    setValue("street", item.addresses[0]?.street || "");
    setValue("city", item.addresses[0]?.city || "");
    setValue("state", item.addresses[0]?.state || "");
    setValue("country", item.addresses[0]?.country || "");
    setValue("pincode", item.addresses[0]?.pincode || "");
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`api/topnav/${id}`, {
        withCredentials: true,
      });
      fetchTopNavItems();
      toast.success("Top nav item deleted successfully!");
    } catch (err) {
      console.error("Error deleting top nav item:", err);
      toast.error("Failed to delete top nav item!");
    } finally {
      setDeleteItem(null); // Close the delete confirmation dialog
    }
  };

  const openDeleteConfirmation = (item) => {
    setDeleteItem(item);
  };

  const closeDeleteConfirmation = () => {
    setDeleteItem(null);
  };

  // Function to handle input change and enforce numeric-only input
  const handleInputChange = (event) => {
    event.target.value = event.target.value.replace(/\D+/g, '');
  };

  // Function to remove special characters from input
  const handleSpecialCharChange = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
  };

  // Function to handle trimming of white spaces
  const handleTrim = (event) => {
    event.target.value = event.target.value.trim();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Top Navigation Manager
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          backgroundColor: "#f9fbe7",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginBottom: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Title"
                fullWidth
                size="small"
                {...register("title", {
                  required: "Title is required",
                  validate: (value) => !!value.trim() || "Title cannot be empty",
                  onChange: handleSpecialCharChange,
                })}
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
                sx={{ backgroundColor: "#f9fbe7", color: "black" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Email"
                fullWidth
                size="small"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                  validate: (value) => !!value.trim() || "Email cannot be empty",
                })}
                onChange={handleTrim}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                sx={{ backgroundColor: "#f9fbe7", color: "#000000" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Phone 1"
                fullWidth
                size="small"
                inputProps={{ maxLength: 10, onInput: handleInputChange }}
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone must be exactly 10 digits",
                  },
                  validate: (value) => !!value.trim() || "Phone cannot be empty",
                })}
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Phone 2"
                fullWidth
                size="small"
                inputProps={{ maxLength: 10, onInput: handleInputChange }}
                {...register("mobileNo", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Mobile number must be exactly 10 digits",
                  },
                  validate: (value) => !!value.trim() || "Mobile number cannot be empty",
                })}
                error={!!errors.mobileNo}
                helperText={errors.mobileNo ? errors.mobileNo.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Street"
                fullWidth
                size="small"
                {...register("street", {
                  validate: (value) => !!value.trim() || "Street cannot be empty",
                  onChange: handleSpecialCharChange,
                })}
                error={!!errors.street}
                helperText={errors.street ? errors.street.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="City"
                fullWidth
                size="small"
                {...register("city", {
                  validate: (value) => !!value.trim() || "City cannot be empty",
                  onChange: handleSpecialCharChange,
                })}
                error={!!errors.city}
                helperText={errors.city ? errors.city.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="State"
                fullWidth
                size="small"
                {...register("state", {
                  validate: (value) => !!value.trim() || "State cannot be empty",
                  onChange: handleSpecialCharChange,
                })}
                error={!!errors.state}
                helperText={errors.state ? errors.state.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Country"
                fullWidth
                size="small"
                {...register("country", {
                  validate: (value) => !!value.trim() || "Country cannot be empty",
                  onChange: handleSpecialCharChange,
                })}
                error={!!errors.country}
                helperText={errors.country ? errors.country.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Pincode"
                fullWidth
                size="small"
                inputProps={{ maxLength: 6, onInput: handleInputChange }}
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Pincode must be exactly 6 digits",
                  },
                  validate: (value) => !!value.trim() || "Pincode cannot be empty",
                })}
                error={!!errors.pincode}
                helperText={errors.pincode ? errors.pincode.message : ""}
                sx={{ backgroundColor: "#f9fbe7" }}
                onBlur={handleTrim}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {editItem ? "Update Item" : "Add Item"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                reset();
                setEditItem(null);
              }}
              sx={{ ml: 2 }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone 1</TableCell>
              <TableCell>Phone 2</TableCell>
              <TableCell>Street</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Pincode</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topNavItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.mobileNo}</TableCell>
                <TableCell>{item.addresses[0]?.street || 'N/A'}</TableCell>
                <TableCell>{item.addresses[0]?.city || 'N/A'}</TableCell>
                <TableCell>{item.addresses[0]?.state || 'N/A'}</TableCell>
                <TableCell>{item.addresses[0]?.country || 'N/A'}</TableCell>
                <TableCell>{item.addresses[0]?.pincode || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => openDeleteConfirmation(item)}>
                    <Delete color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={!!deleteItem}
        onClose={closeDeleteConfirmation}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this top nav item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => deleteItem && handleDelete(deleteItem._id)}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default Topnav;
