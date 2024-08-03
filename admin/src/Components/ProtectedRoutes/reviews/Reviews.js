import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[1],
  borderRadius: 12,
  backgroundColor: "#f9fbe7",
  maxWidth: "400px",
  margin: "auto",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 16,
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s",
  background: "#ffffff",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ReviewImage = styled("img")({
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  marginTop: "8px",
  borderRadius: "50%",
});

const RatingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const CustomRating = ({ value, setValue }) => {
  const [hover, setHover] = useState(-1);

  return (
    <RatingContainer>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <IconButton
            key={index}
            onClick={() => setValue(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(-1)}
            style={{ padding: 0 }}
          >
            {value >= ratingValue ? (
              <StarIcon style={{ fill: "#ffc107" }} />
            ) : hover >= ratingValue ? (
              <StarIcon style={{ fill: "#ffc107" }} />
            ) : (
              <StarBorderIcon style={{ fill: "#ffc107" }} />
            )}
          </IconButton>
        );
      })}
    </RatingContainer>
  );
};

const Reviews = () => {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState("");
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get("/api/reviews", {
        withCredentials: true,
        params: { page: currentPage },
      });
      if (response.data && response.data.reviews) {
        const reviewsWithImages = response.data.reviews.map((review) => ({
          ...review,
          imageUrl: review.image,
        }));
        setReviewsList(reviewsWithImages);
        setTotalPages(Math.ceil(response.data.totalReviews / 3)); // Assuming 3 reviews per page
      } else {
        setReviewsList([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append("file", image);
    }
    formData.append("name", name);
    formData.append("district", district);
    formData.append("stars", stars);
    formData.append("reviews", reviews);

    console.log("Form data being sent:", {
      name,
      district,
      stars,
      reviews,
      image: image ? image.name : null,
    });

    try {
      if (editMode) {
        const response = await axiosInstance.put(
          `/api/update-reviews/${editId}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("PUT response:", response.data);
        setEditMode(false);
        setEditId(null);
        alert("Review updated successfully!");
      } else {
        const response = await axiosInstance.post(
          "/api/reviews",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("POST response:", response.data);
        alert("Review added successfully!");
      }
      setSuccess(true);
      setError(false);
      setName("");
      setDistrict("");
      setStars(0);
      setReviews("");
      setImage(null);
      fetchReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(true);
      setSuccess(false);
      console.error("There was an error uploading the review!", error);
      alert("There was an error uploading the review!");
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleEdit = (review) => {
    setEditMode(true);
    setEditId(review._id);
    setName(review.name);
    setDistrict(review.district);
    setStars(review.stars);
    setReviews(review.reviews);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/reviews/${deleteId}`, {
        withCredentials: true,
      });
      fetchReviews();
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("There was an error deleting the review!", error);
      alert("There was an error deleting the review!");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleImageUploadButtonClick = () => {
    document.getElementById("upload-image").click();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        {editMode ? "Edit Review" : "Add Review"}
      </Typography>
      {success && (
        <Alert severity="success">
          {editMode
            ? "Review updated successfully!"
            : "Review added successfully!"}
        </Alert>
      )}
      {error && (
        <Alert severity="error">
          There was an error. Please check your input and try again.
        </Alert>
      )}
      <FormContainer elevation={3}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                variant="outlined"
                size="small"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend">Stars</Typography>
              <CustomRating value={stars} setValue={setStars} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review"
                variant="outlined"
                multiline
                rows={4}
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImageUploadButtonClick}
                style={{ borderRadius: 16 }}
              >
                {image ? image.name : "Upload Image"}
              </Button>
              <input
                id="upload-image"
                type="file"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </Grid>
            <Grid item xs={12}>
              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                {editMode ? "Update Review" : "Add Review"}
              </SubmitButton>
            </Grid>
          </Grid>
        </Box>
      </FormContainer>
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Reviews
        </Typography>
        <Grid container spacing={3}>
          {reviewsList.map((review) => (
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <ReviewCard>
                <CardContent>
                  {review.imageUrl && (
                    <ReviewImage src={review.imageUrl} alt="Review" />
                  )}
                  <Typography variant="h6" component="h2">
                    {review.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {review.district}
                  </Typography>
                  <RatingContainer>
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        style={{
                          fill: index < review.stars ? "#ffc107" : "#e4e5e9",
                        }}
                      />
                    ))}
                  </RatingContainer>
                  <Typography variant="body2" component="p">
                    {review.reviews}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(review)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(review._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </ReviewCard>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{"Delete Review"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default Reviews;
