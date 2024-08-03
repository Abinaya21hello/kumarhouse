import React, { useContext, useState } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { MyContext } from "../../App";
import bannerImg from "../../assets/banner/smallbanner1.jpg";
import "./sidebar.css";

const Sidebar = ({
  categories,
  filterByBrand,
  filterByRating,
  filterByPrice,
  filterByMainProduct,
  loading,
}) => {
  const [value, setValue] = useState([40, 300]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const context = useContext(MyContext);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    filterByBrand(categoryId);
  };

  const handleSubCategoryChange = (event) => {
    const subCategoryId = event.target.value;
    setSelectedSubCategory(subCategoryId);
    filterByMainProduct(subCategoryId);
  };

  const handleRatingChange = (event) => {
    const ratingValue = event.target.value;
    setSelectedRating(ratingValue);
    filterByRating(ratingValue);
  };

  const handlePriceChange = (value) => {
    setValue(value);
    filterByPrice(value[0], value[1]);
  };

  const getMainProducts = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.models : [];
  };

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };

  return (
    <div className="sidebarContainer">
      {isSmallScreen && (
        // Menu icon for small screens
        <IconButton onClick={() => toggleDrawer(true)} className="menuIcon">
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer for small screens */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        className="sidebarDrawer"
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <div className="drawerHeader">
          <IconButton onClick={() => toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="sidebarContent">
          <div className="card border-0 shadow res-hide">
            <h3>Category</h3>
            <FormControl fullWidth variant="outlined" className="mb-3">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCategory && (
              <FormControl fullWidth variant="outlined" className="mb-3">
                <InputLabel id="main-product-select-label">
                  Main Products
                </InputLabel>
                <Select
                  labelId="main-product-select-label"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  label="Main Products"
                >
                  {getMainProducts(selectedCategory).map((mainProduct) => (
                    <MenuItem key={mainProduct._id} value={mainProduct._id}>
                      {mainProduct.mainProduct}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          <div className="card border-0 shadow">
            <h3>Filter by price</h3>
            <RangeSlider
              value={value}
              onInput={handlePriceChange}
              min={40}
              max={300}
              step={50}
            />

            <div className="d-flex pt-2 pb-2 priceRange">
              <span>
                From: <strong className="text-success">Rs: {value[0]}</strong>
              </span>
              <span className="ml-auto">
                To: <strong className="text-success">Rs: {value[1]}</strong>
              </span>
            </div>

            <div className="filters pt-0">
              <h5>Filter By Ratings</h5>
              <ul>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  onChange={handleRatingChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1 star & above"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="2 stars & above"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="3 stars & above"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label="4 stars & above"
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio />}
                    label="5 stars"
                  />
                </RadioGroup>
              </ul>
            </div>

            <div className="d-flex filterWrapper">
              <Button
                className="btn btn-g w-100"
                onClick={() => context.openFilters()}
              >
                <FilterAltOutlinedIcon /> Filter
              </Button>
            </div>
          </div>

          <img src={bannerImg} className="w-100" alt="sidebar banner" />
        </div>
      </Drawer>

      {/* Sidebar for larger screens */}
      {!isSmallScreen && (
        <div className="sidebar">
          <div className="card border-0 shadow res-hide">
            <h3>Category</h3>
            <FormControl fullWidth variant="outlined" className="mb-3">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCategory && (
              <FormControl fullWidth variant="outlined" className="mb-3">
                <InputLabel id="main-product-select-label">
                  Main Products
                </InputLabel>
                <Select
                  labelId="main-product-select-label"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  label="Main Products"
                >
                  {getMainProducts(selectedCategory).map((mainProduct) => (
                    <MenuItem key={mainProduct._id} value={mainProduct._id}>
                      {mainProduct.mainProduct}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          <div className="card border-0 shadow">
            <h3>Filter by price</h3>
            <RangeSlider
              value={value}
              onInput={handlePriceChange}
              min={40}
              max={300}
              step={50}
            />

            <div className="d-flex pt-2 pb-2 priceRange">
              <span>
                From: <strong className="text-success">Rs: {value[0]}</strong>
              </span>
              <span className="ml-auto">
                To: <strong className="text-success">Rs: {value[1]}</strong>
              </span>
            </div>

            <div className="filters pt-0">
              <h5>Filter By Ratings</h5>
              <ul>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  onChange={handleRatingChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1 star & above"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="2 stars & above"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="3 stars & above"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label="4 stars & above"
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio />}
                    label="5 stars"
                  />
                </RadioGroup>
              </ul>
            </div>

            <div className="d-flex filterWrapper">
              <Button
                className="btn btn-g w-100"
                onClick={() => context.openFilters()}
              >
                <FilterAltOutlinedIcon /> Filter
              </Button>
            </div>
          </div>

          <img src={bannerImg} className="w-100" alt="sidebar banner" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
