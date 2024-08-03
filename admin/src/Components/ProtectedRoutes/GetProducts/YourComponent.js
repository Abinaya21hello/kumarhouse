import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css"; // Import your CSS file
import axiosInstance from '../../api/axiosInstance'
const YourComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMainProduct, setSelectedMainProduct] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({}); // Data to be edited
  const [imageFile, setImageFile] = useState(null); // Image file state
  const [showFullDescription, setShowFullDescription] = useState(false); // State to manage full description display

  // category
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogCategory, setDialogCategory] = useState("");
  const [dialogCategoryName, setDialogCategoryName] = useState("");

  //model
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [dialogModel, setDialogModel] = useState("");
  const [dialogModelName, setDialogModelName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [dialogModelName, editData]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        "api/getProducts",
        {
          withCredentials: true,
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSelectedMainProduct(""); // Reset main product selection
    setSelectedModel(null); // Reset selected model
  };

  const handleMainProductChange = (event) => {
    const mainProductId = event.target.value;
    setSelectedMainProduct(mainProductId);
    // Find the selected category
    const category = categories.find((cat) => cat._id === selectedCategory);
    // Find the selected main product
    const mainProduct = category.models.find(
      (model) => model._id === mainProductId
    );
    setSelectedModel(mainProduct);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setOpenModal(true);
  };

  const handleDeleteClick = async (itemId, type) => {
    try {
      let apiUrl = "";
      if (type === "Category") {
        apiUrl = `https://back.eherbals.in/api/category-delete/${itemId}`;
      } else {
        apiUrl =`https://back.eherbals.in/api/sub-product-delete/${selectedCategory}/models/${selectedMainProduct}/sub/${itemId}`;
      }

      await axios.delete(apiUrl, {
        withCredentials: true,
      });

      if (type === "Category") {
        // Remove the category and its models
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== itemId)
        );
        setSelectedCategory(""); // Reset selected category
        setSelectedMainProduct(""); // Reset selected main product
        setSelectedModel(null); // Reset selected model
      } else {
        // Update products or sub-products list after deletion
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            models: category.models.map((model) =>
              model._id === selectedMainProduct
                ? {
                    ...model,
                    subProduct: model.subProduct.filter(
                      (sub) => sub._id !== itemId
                    ),
                  }
                : model
            ),
          }))
        );
      }

      alert("Product deleted successfully!");
    } catch (error) {
      console.error(`Error deleting ${type}: ${error}`);
      alert("Failed to delete product.");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenModelDialog(false);
    setEditData({}); // Clear edit data
    setImageFile(null); // Clear image file
  };

  const handleEditSave = async () => {
    try {
      const {
        subproductname,
        shortdescription,
        briefDescription,
        currentPrice,
        Stock,
        offerPrice,
        grams,
        TopSelling,
        ratings,
      } = editData;

      let apiUrl = "";
      if (editData.type === "Category") {
        apiUrl = "https://back.eherbals.in/api/category-update";
      } else {
        apiUrl = `https://back.eherbals.in/api/sub-product-update/${selectedCategory}/models/${selectedMainProduct}/sub/${editData._id}`;
      }

      const formData = new FormData();
      formData.append("subproductname", subproductname);
      formData.append("shortdescription", shortdescription);
      formData.append("briefDescription", briefDescription);
      formData.append("currentPrice", currentPrice);
      formData.append("Stock", Stock);
      formData.append("offerPrice", offerPrice);
      formData.append("grams", grams);
      formData.append("TopSelling", TopSelling);
      formData.append("ratings", ratings);

      if (imageFile) {
        formData.append("file", imageFile);
      }

      await axios.put(apiUrl, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update state after edit
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          models: category.models.map((model) =>
            editData.type === "MainProduct"
              ? model._id === editData._id
                ? { ...model, ...editData }
                : model
              : {
                  ...model,
                  subProduct: model.subProduct.map((subProduct) =>
                    subProduct._id === editData._id
                      ? { ...subProduct, ...editData }
                      : subProduct
                  ),
                }
          ),
        }))
      );

      alert("Product updated successfully!");
      handleModalClose(); // Close modal after successful edit
    } catch (error) {
      console.error(`Error editing ${editData.type}: ${error}`);
      alert("Failed to update product.");
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleCategoryDelete = async (categoryId) => {
    try {
      await axios.delete(

       ` https://back.eherbals.in/api/category-delete/${categoryId}`,


        {
          withCredentials: true,
        }
      );
      // Update state after deletion
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
      setSelectedCategory(""); // Reset selected category
      setSelectedMainProduct(""); // Reset selected main product
      setSelectedModel(null); // Reset selected model

      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleCategoryEditClick = (category) => {
    setDialogCategory(category);
    setDialogCategoryName(category.category);
    setOpenDialog(true);
  };

  const handleUpdateCategory = async () => {
    try {
      const updatedCategory = {
        ...dialogCategory,
        category: dialogCategoryName,
      };
      await axios.put(

       ` https://back.eherbals.in/api/category-update/${dialogCategory._id}`,

        updatedCategory
      );
      setOpenDialog(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogCategory(null);
    setOpenModelDialog(false);
    setDialogCategoryName("");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleCategoryModelEditClick = (model) => {
    // setEditData({ ...model, type: "MainProduct" }); // Set type to distinguish between category and main product
    setDialogModel(model);
    setDialogCategoryName(model.mainProduct);
    setOpenModelDialog(true);
  };
  // const handleCategoryEditClick = (category) => {
  //   setDialogCategory(category);
  //   setDialogCategoryName(category.category);
  //   setOpenDialog(true);
  // };

  const handleCategoryModelDelete = async (modelId) => {
    try {
      const apiUrl = `https://back.eherbals.in/api/products-delete/${selectedCategory}/models/${modelId}`;

      await axios.delete(apiUrl, {
        withCredentials: true,
      });

      // Update state after deletion
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          models: category.models.filter((model) => model._id !== modelId),
        }))
      );

      setSelectedMainProduct(""); // Reset selected main product
      setSelectedModel(null); // Reset selected model

      alert("Main product deleted successfully!");
    } catch (error) {
      console.error("Error deleting main product:", error);
      alert("Failed to delete main product.");
    }
  };

  const handleCategoryModelUpdate = async () => {
    try {
      const updatedModel = {
        ...dialogModel,
        mainProduct: dialogModelName,
      };
      const apiUrl = `https://back.eherbals.in/api/products-update/${selectedCategory}/models/${dialogModel._id}`;

      await axios.put(apiUrl, updatedModel, {
        withCredentials: true,
      });

      // Update state after edit
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          models: category.models.map((model) =>
            model._id === dialogModel._id ? { ...model, ...dialogModel } : model
          ),
        }))
      );

      alert("Main product updated successfully!");
      handleModalClose(); // Close modal after successful edit
    } catch (error) {
      console.error("Error updating main product:", error);
      alert("Failed to update main product.");
    }
  };

  return (
    <Box className="your-component" p={3}>
      <Grid container spacing={2} className="dropdowns-row">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <TextField
              select
              label="Category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="outlined"
            >
              {categories.map((category) => (
                <MenuItem
                  key={category._id}
                  value={category._id}
                  className="d-flex justify-content-between"
                >
                  {category.category}
                  <div>
                    <IconButton
                      onClick={() => handleCategoryEditClick(category)}
                      aria-label="edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleCategoryDelete(category._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <TextField
              select
              label="Model"
              value={selectedMainProduct}
              onChange={handleMainProductChange}
              variant="outlined"
              disabled={!selectedCategory} // Disable if no category is selected
            >
              {selectedCategory &&
                categories
                  .find((category) => category._id === selectedCategory)
                  ?.models.map((model) => (
                    <MenuItem
                      key={model._id}
                      value={model._id}
                      className=" d-flex
                      justify-content-between"
                    >
                      {model.mainProduct}
                      <div>
                        <IconButton
                          onClick={() => handleCategoryModelEditClick(model)}
                          aria-label="edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleCategoryModelDelete(model._id)}
                          aria-label="delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </MenuItem>
                  ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>

      {selectedModel && (
        <Grid container spacing={2}>
          {selectedModel.subProduct
            .slice(indexOfFirstItem, indexOfLastItem)
            .map((subProduct) => (
              <Grid item xs={12} sm={6} md={4} key={subProduct._id}>
                <Paper elevation={3} className="product-card">
                  <Box p={2}>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <img
                        src={subProduct.image}
                        alt={subProduct.subproductname}
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">
                        {subProduct.subproductname}
                      </Typography>
                    </Box>
                    <Typography variant="h6">
                      {subProduct.shortdescription}
                    </Typography>
                    <Typography variant="body2">
                      {showFullDescription
                        ? subProduct.briefDescription
                        : `${subProduct.briefDescription.substring(0, 100)}...`}
                      <Button size="small" onClick={toggleDescription}>
                        {showFullDescription ? "Read Less" : "Read More"}
                      </Button>
                    </Typography>
                    <Typography variant="body1">
                      Price: ${subProduct.currentPrice}
                    </Typography>
                    <Typography variant="body1">
                      Stock: {subProduct.Stock}
                    </Typography>
                    <Typography variant="body1">
                      Offer Price: ${subProduct.offerPrice}
                    </Typography>
                    <Typography variant="body1">
                      Weight: {subProduct.grams} grams
                    </Typography>
                    <Typography variant="body1">
                      Top Selling: {subProduct.TopSelling ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body1">
                      Ratings: {subProduct.ratings}
                    </Typography>
                    <Box className="d-flex justify-content-end">
                      <IconButton
                        onClick={() => handleEditClick(subProduct)}
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(subProduct._id)}
                        aria-label="delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {selectedModel && selectedModel.subProduct.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(selectedModel.subProduct.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, page) => paginate(page)}
          className="pagination"
        />
      )}

      <Dialog
        open={openModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Sub Product Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="subproductname"
            value={editData.subproductname || ""}
            onChange={(e) =>
              setEditData({ ...editData, subproductname: e.target.value })
            }
          />
          <TextField
            label="Short Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="shortdescription"
            value={editData.shortdescription || ""}
            onChange={(e) =>
              setEditData({ ...editData, shortdescription: e.target.value })
            }
          />
          <TextField
            label="Brief Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="briefDescription"
            value={editData.briefDescription || ""}
            onChange={(e) =>
              setEditData({ ...editData, briefDescription: e.target.value })
            }
          />
          <TextField
            label="Current Price"
            variant="outlined"
            fullWidth
            margin="normal"
            name="currentPrice"
            type="number"
            value={editData.currentPrice || ""}
            onChange={(e) =>
              setEditData({ ...editData, currentPrice: e.target.value })
            }
          />
          <TextField
            label="Stock"
            variant="outlined"
            fullWidth
            margin="normal"
            name="Stock"
            type="number"
            value={editData.Stock || ""}
            onChange={(e) =>
              setEditData({ ...editData, Stock: e.target.value })
            }
          />
          <TextField
            label="Offer Price"
            variant="outlined"
            fullWidth
            margin="normal"
            name="offerPrice"
            type="number"
            value={editData.offerPrice || ""}
            onChange={(e) =>
              setEditData({ ...editData, offerPrice: e.target.value })
            }
          />
          <TextField
            label="Grams"
            variant="outlined"
            fullWidth
            margin="normal"
            name="grams"
            value={editData.grams || ""}
            onChange={(e) =>
              setEditData({ ...editData, grams: e.target.value })
            }
          />
          <TextField
            select
            label="Top Selling"
            variant="outlined"
            fullWidth
            margin="normal"
            name="TopSelling"
            value={editData.TopSelling || ""}
            onChange={(e) =>
              setEditData({ ...editData, TopSelling: e.target.value })
            }
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
          <TextField
            label="Ratings"
            variant="outlined"
            fullWidth
            margin="normal"
            name="ratings"
            value={editData.ratings || ""}
            onChange={(e) =>
              setEditData({ ...editData, ratings: e.target.value })
            }
          />
          <input
            accept="image/*"
            src={editData.image || ""}
            id="contained-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="outlined"
              component="span"
              style={{ marginTop: "1rem" }}
            >
              Upload Image
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* category dialog code */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={dialogCategoryName || ""}
            onChange={(e) => setDialogCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* model dialog code  */}
      <Dialog
        open={openModelDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Main Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Main Product Name"
            type="text"
            fullWidth
            value={dialogModelName || ""}
            onChange={(e) => setDialogModelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCategoryModelUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default YourComponent;
