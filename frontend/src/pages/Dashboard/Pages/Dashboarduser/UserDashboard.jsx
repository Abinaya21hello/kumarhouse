import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Avatar,
  Grid, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Snackbar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { green, yellow, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar";
import './UserDashboard.css'; // Import the CSS file

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: green[500],
  width: theme.spacing(20),
  height: theme.spacing(20),
  fontSize: theme.typography.h1.fontSize,
  [theme.breakpoints.down('sm')]: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    fontSize: theme.typography.h3.fontSize,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: "none",
  padding: theme.spacing(1, 3),
  fontSize: theme.typography.h6.fontSize,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
    fontSize: theme.typography.body1.fontSize,
  },
}));

const EditButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: green[500],
  color: theme.palette.getContrastText(green[500]),
  "&:hover": {
    backgroundColor: green[600],
  },
}));

const DeleteButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: yellow[700],
  color: theme.palette.getContrastText(yellow[700]),
  "&:hover": {
    backgroundColor: yellow[800],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
}));

const SubmitButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const CancelButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: grey[500],
  color: theme.palette.getContrastText(grey[500]),
  "&:hover": {
    backgroundColor: grey[600],
  },
}));

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[6],
  padding: theme.spacing(3),
  width: '100%',
}));

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [errors, setErrors] = useState({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("User not found. Please log in.");
          navigate("/signIn");
          return;
        }

        const response = await axiosInstance.get(`api/get-user/${userId}`, {
          withCredentials: true,
        });
        
        console.log("Fetched user data:", response.data); // Check the structure here
        setUser(response.data);
        setUpdatedUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");
    if (nameParts.length > 1) {
      const [field, index, subField] = nameParts;
      setUpdatedUser((prevUser) => ({
        ...prevUser,
        [field]: prevUser[field].map((item, i) =>
          i === parseInt(index) ? { ...item, [subField]: value } : item
        ),
      }));
    } else {
      setUpdatedUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!updatedUser.name) newErrors.name = "Name is required";
    if (!updatedUser.phone) newErrors.phone = "Phone is required";
    if (updatedUser.phone && !/^\d{10}$/.test(updatedUser.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!updatedUser.gender) newErrors.gender = "Gender is required";
    if (updatedUser.address) {
      updatedUser.address.forEach((address, index) => {
        if (!address.street) newErrors[`address.${index}.street`] = "Street is required";
        if (!address.district) newErrors[`address.${index}.district`] = "District is required";
        if (!address.state) newErrors[`address.${index}.state`] = "State is required";
        if (!address.country) newErrors[`address.${index}.country`] = "Country is required";
        if (!address.pincode) newErrors[`address.${index}.pincode`] = "Pin Code is required";
        if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
          newErrors[`address.${index}.pincode`] = "Pin Code must be 6 digits";
        }
      });
    }
    setErrors(newErrors);
    Object.keys(newErrors).forEach((key) => {
      alert(newErrors[key]);
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      const userId = localStorage.getItem("userId");
      await axiosInstance.put(
        `api/update-user-account/${userId}`,
        updatedUser,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(updatedUser);
      setEditDialogOpen(false);
      alert("Profile updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      alert('Are you sure want to delete this Account')
      await axiosInstance.delete(`api/delete-user-account/${userId}`, {

        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Account deleted successfully");
      localStorage.removeItem("userId");
      navigate("/signIn");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert('Are You Sure Want To Delete This Account?')
      alert("Failed to delete account");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!user) {
    return (
      <StyledContainer>
        <Sidebar />
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress size={80} />
        </Box>
        <ToastContainer />
      </StyledContainer>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <StyledContainer>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <StyledAvatar className="avatar" style={{fontSize:'60px', color:'yellow'}}>{firstName.charAt(0)}</StyledAvatar>
            <Typography variant="h4" className="typography--header" style={{color:'green'}}>
              MY PROFILE
            </Typography>
            <Typography variant="h5" className="typography--subheader">
              {user.email}
            </Typography>

            <StyledTableContainer>
              <Box>
                <Typography variant="h5" style={{fontSize:'25px',color:'black'}}>NAME</Typography>
                <Typography variant="body1" style={{fontSize:'20px',color:'green'}}>{user.name}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" style={{fontSize:'25px',color:'black'}}>EMAIL</Typography>
                <Typography variant="body1" style={{fontSize:'20px',color:'green'}}>{user.email}</Typography>
                <Typography variant="body2" style={{ fontSize: '16px', color:'red' }}>Note:Email cannot be changed</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" style={{fontSize:'25px',color:'black'}}>PHONE</Typography>
                <Typography variant="body1" style={{fontSize:'20px',color:'green'}}>{user.phone}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" style={{fontSize:'25px',color:'black'}}>GENDER</Typography>
                <Typography variant="body1" style={{fontSize:'20px',color:'green'}}>{user.gender}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" style={{fontSize:'25px',color:'black'}}>ADDRESS</Typography>
                {user.address && user.address.map((address, index) => (
                  <Box key={index} className="address">
                    <Typography variant="body1" style={{fontSize:'20px',color:'green'}}>{address.street}, {address.district}, {address.state}, {address.country}, {address.pincode}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <EditButton onClick={handleEditClick}>Edit Profile</EditButton>
                <DeleteButton onClick={handleDeleteAccount}>Delete Account</DeleteButton>
              </Box>
            </StyledTableContainer>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="h6" color="textSecondary">Edit your profile details below:</Typography>
          </Box>
          <StyledTextField
            label="Name"
            name="name"
            value={updatedUser.name || ''}
            onChange={handleEditChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <StyledTextField
            label="Phone"
            name="phone"
            value={updatedUser.phone || ''}
            onChange={handleEditChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <StyledTextField
            label="Gender"
            name="gender"
            value={updatedUser.gender || ''}
            onChange={handleEditChange}
            error={!!errors.gender}
            helperText={errors.gender}
          />
          {updatedUser.address && updatedUser.address.map((address, index) => (
            <Box key={index} mb={2}>
              <Typography variant="h6" color="textSecondary">Address {index + 1}</Typography>
              <StyledTextField
                label="Street"
                name={`address.${index}.street`}
                value={address.street || ''}
                onChange={handleEditChange}
                error={!!errors[`address.${index}.street`]}
                helperText={errors[`address.${index}.street`]}
              />
              <StyledTextField
                label="District"
                name={`address.${index}.district`}
                value={address.district || ''}
                onChange={handleEditChange}
                error={!!errors[`address.${index}.district`]}
                helperText={errors[`address.${index}.district`]}
              />
              <StyledTextField
                label="State"
                name={`address.${index}.state`}
                value={address.state || ''}
                onChange={handleEditChange}
                error={!!errors[`address.${index}.state`]}
                helperText={errors[`address.${index}.state`]}
              />
              <StyledTextField
                label="Country"
                name={`address.${index}.country`}
                value={address.country || ''}
                onChange={handleEditChange}
                error={!!errors[`address.${index}.country`]}
                helperText={errors[`address.${index}.country`]}
              />
              <StyledTextField
                label="Pin Code"
                name={`address.${index}.pincode`}
                value={address.pincode || ''}
                onChange={handleEditChange}
                error={!!errors[`address.${index}.pincode`]}
                helperText={errors[`address.${index}.pincode`]}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={() => setEditDialogOpen(false)}>Cancel</CancelButton>
          <SubmitButton onClick={handleEditSave}>Save</SubmitButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Update completed"
      />
      <ToastContainer />
    </StyledContainer>
  );
};

export default UserDashboard;
