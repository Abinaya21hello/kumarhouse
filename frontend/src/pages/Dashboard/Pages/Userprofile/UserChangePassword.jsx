import React, { useState } from "react";
import Sidebar from '../../Pages/Sidebar';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Grid
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Validation Schema for Password Update
const PasswordUpdateSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters long")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least one letter, one number, and one special character"
    ),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "New passwords do not match")
    .required("Confirm new password is required"),
});

// Styled Components
const FormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: theme.shadows[6],
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& label.Mui-focused': {
    color: 'green',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'green',
    },
    '&:hover fieldset': {
      borderColor: 'green',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green',
    },
  },
  '& .Mui-error': {
    '& fieldset': {
      borderColor: '#d32f2f',
    },
    '& label': {
      color: '#d32f2f',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#d32f2f',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#d32f2f',
      },
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const PasswordUpdateForm = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmitPassword = async (values, { setSubmitting, resetForm }) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.put(
        `api/update-user-account-password/${userId}`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      resetForm();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error occurred while updating password"
      );
    }
    setSubmitting(false);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="#f0f0f0"
          padding={4}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              <FormCard>
                <CardHeader
                  title={<Typography variant="h4">Update Password</Typography>}
                />
                <CardContent>
                  <Formik
                    initialValues={{
                      oldPassword: "",
                      newPassword: "",
                      confirmNewPassword: "",
                    }}
                    validationSchema={PasswordUpdateSchema}
                    onSubmit={handleSubmitPassword}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field
                          as={StyledTextField}
                          name="oldPassword"
                          label="Old Password"
                          type={showOldPassword ? "text" : "password"}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowOldPassword(!showOldPassword)}
                                  edge="end"
                                >
                                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          helperText={<ErrorMessage name="oldPassword" component="div" />}
                          error={!!<ErrorMessage name="oldPassword" component="div" />}
                        />
                        <Field
                          as={StyledTextField}
                          name="newPassword"
                          label="New Password"
                          type={showNewPassword ? "text" : "password"}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          helperText={<ErrorMessage name="newPassword" component="div" />}
                          error={!!<ErrorMessage name="newPassword" component="div" />}
                        />
                        <Field
                          as={StyledTextField}
                          name="confirmNewPassword"
                          label="Confirm New Password"
                          type={showConfirmNewPassword ? "text" : "password"}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                  edge="end"
                                >
                                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          helperText={<ErrorMessage name="confirmNewPassword" component="div" />}
                          error={!!<ErrorMessage name="confirmNewPassword" component="div" />}
                        />
                        <Box display="flex" justifyContent="center">
                          <SubmitButton
                            type="submit"
                            disabled={isSubmitting}
                            startIcon={isSubmitting && <CircularProgress size="1rem" />}
                          >
                            {isSubmitting ? "Updating..." : "Update Password"}
                          </SubmitButton>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </FormCard>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default PasswordUpdateForm;
