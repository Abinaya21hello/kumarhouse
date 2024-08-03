import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../api/axiosInstance';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  backgroundColor: '#f9fbe7',
  maxWidth: '600px',
  margin: 'auto',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 20,
}));

const CustomFileInput = styled('input')(({ theme }) => ({
  display: 'none',
}));

const CustomFileInputLabel = styled('label')(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  display: 'inline-block',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AddProduct = () => {
  const [category, setCategory] = useState('');
  const [mainProduct, setMainProduct] = useState('');
  const [currentSubProduct, setCurrentSubProduct] = useState({
    subproductname: '',
    shortdescription: '',
    briefDescription: '',
    currentPrice: '',
    offerPrice: '',
    grams: '',
    Stock: '',
    TopSelling: true,
    ratings: '',
    image: null,
  });
  const [imageName, setImageName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [briefDescError, setBriefDescError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [mainProductError, setMainProductError] = useState('');
  const [offerPriceError, setOfferPriceError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('api/categories', {
          withCredentials: true,
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubProductChange = (field, value) => {
    const stringValue = typeof value === 'string' ? value : '';

    if (field === 'briefDescription') {
      if (stringValue.length < 150 || stringValue.length > 200) {
        setBriefDescError('Brief Description must be between 150 and 200 characters.');
      } else {
        setBriefDescError('');
      }
    }

    setCurrentSubProduct((prevSubProduct) => ({
      ...prevSubProduct,
      [field]: stringValue,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value.replace(/^\s\s*/, '');
    if (value.length < 3 || value.length > 20) {
      setCategoryError('Category must be between 3 and 15 characters.');
    } else if (/[^A-Za-z\s]/.test(value)) {
      setCategoryError('Category cannot contain special characters.');
    } else {
      setCategoryError('');
    }
    setCategory(value);
  };

  const handleMainProductChange = (e) => {
    const value = e.target.value.replace(/^\s\s*/, '');
    if (value.length < 3 || value.length > 20) {
      setMainProductError('Main Product must be between 3 and 15 characters.');
    } else if (/[^A-Za-z\s]/.test(value)) {
      setMainProductError('Main Product cannot contain special characters.');
    } else {
      setMainProductError('');
    }
    setMainProduct(value);
  };

  const handleSubProductInputChange = (field, value) => {
    if (value.length < 3 || value.length > 20) {
      setBriefDescError('Sub Product Name and Short Description must be between 3 and 15 characters.');
    } else if (/[^A-Za-z\s]/.test(value)) {
      setBriefDescError('Sub Product Name and Short Description cannot contain special characters.');
    } else {
      setBriefDescError('');
    }
    setCurrentSubProduct((prevSubProduct) => ({
      ...prevSubProduct,
      [field]: value.replace(/^\s\s*/, ''),
    }));
  };

  const handleNumericInputChange = (e, fieldName) => {
    const value = e.target.value.replace(/\D/g, '');
    handleSubProductChange(fieldName, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCurrentSubProduct((prevSubProduct) => ({
        ...prevSubProduct,
        image: file,
      }));
      setImageName(file.name);
    } else {
      alert('Please select a valid image file.');
      setCurrentSubProduct((prevSubProduct) => ({
        ...prevSubProduct,
        image: null,
      }));
      setImageName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentSubProduct.briefDescription.length < 150 || currentSubProduct.briefDescription.length > 200) {
      setBriefDescError('Brief Description must be between 150 and 200 characters.');
      return;
    }

    if (parseFloat(currentSubProduct.offerPrice) >= parseFloat(currentSubProduct.currentPrice)) {
      setOfferPriceError('Offer Price must be less than Current Price.');
      return;
    } else {
      setOfferPriceError('');
    }

    if (categoryError || mainProductError || briefDescError || offerPriceError) {
      return; // Prevent form submission if there are errors
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('models', JSON.stringify([{ mainProduct, subProduct: [currentSubProduct] }]));
    if (currentSubProduct.image) {
      formData.append('file', currentSubProduct.image);
    }

    try {
      setLoading(true);
      await axiosInstance.post('api/products', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setError(false);
      setCategory('');
      setMainProduct('');
      setCurrentSubProduct({
        subproductname: '',
        shortdescription: '',
        briefDescription: '',
        currentPrice: '',
        offerPrice: '',
        grams: '',
        Stock: '',
        TopSelling: false,
        ratings: '',
        image: null,
      });
      setImageName('');
      setTimeout(() => setSuccess(false), 3000);
      setLoading(false);
    } catch (error) {
      setError(true);
      setSuccess(false);
      console.error('There was an error uploading the product!', error);
      setTimeout(() => setError(false), 3000);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom align="center">
        Add Product
      </Typography>
      {success && <Alert severity="success">Product added successfully!</Alert>}
      {error && <Alert severity="error">There was an error adding the product. Please check your input and try again.</Alert>}
      <FormContainer elevation={3}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Category"
                variant="outlined"
                value={category}
                onChange={handleCategoryChange}
                onBlur={handleCategoryChange}
                error={Boolean(categoryError)}
                helperText={categoryError}
                required
                InputProps={{
                  inputProps: {
                    pattern: '[A-Za-z ]{3,15}',
                    title: 'Only alphabetic characters are allowed and length must be between 3 and 15 characters',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Main Product"
                variant="outlined"
                value={mainProduct}
                onChange={handleMainProductChange}
                onBlur={handleMainProductChange}
                error={Boolean(mainProductError)}
                helperText={mainProductError}
                required
                InputProps={{
                  inputProps: {
                    pattern: '[A-Za-z ]{3,15}',
                    title: 'Only alphabetic characters are allowed and length must be between 3 and 15 characters',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Sub Product Name"
                variant="outlined"
                value={currentSubProduct.subproductname}
                onChange={(e) => handleSubProductInputChange('subproductname', e.target.value)}
                required
                InputProps={{
                  inputProps: {
                    pattern: '[A-Za-z ]{3,15}',
                    title: 'Only alphabetic characters are allowed and length must be between 3 and 15 characters',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Short Description"
                variant="outlined"
                value={currentSubProduct.shortdescription}
                onChange={(e) => handleSubProductInputChange('shortdescription', e.target.value)}
                InputProps={{
                  inputProps: {
                    pattern: '[A-Za-z ]{3,15}',
                    title: 'Only alphabetic characters are allowed and length must be between 3 and 15 characters',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={4}
                label="Brief Description"
                variant="outlined"
                value={currentSubProduct.briefDescription}
                onChange={(e) => handleSubProductChange('briefDescription', e.target.value.replace(/^\s\s*/, ''))}
                error={Boolean(briefDescError)}
                helperText={briefDescError}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Current Price"
                variant="outlined"
                value={currentSubProduct.currentPrice}
                onChange={(e) => handleNumericInputChange(e, 'currentPrice')}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Offer Price"
                variant="outlined"
                value={currentSubProduct.offerPrice}
                onChange={(e) => handleNumericInputChange(e, 'offerPrice')}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                required
                error={Boolean(offerPriceError)}
                helperText={offerPriceError}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Grams"
                variant="outlined"
                value={currentSubProduct.grams}
                onChange={(e) => handleNumericInputChange(e, 'grams')}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Stock"
                variant="outlined"
                value={currentSubProduct.Stock}
                onChange={(e) => handleNumericInputChange(e, 'Stock')}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Top Selling</InputLabel>
                <Select
                  value={currentSubProduct.TopSelling}
                  onChange={(e) => setCurrentSubProduct({ ...currentSubProduct, TopSelling: e.target.value })}
                  size="small"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Ratings"
                variant="outlined"
                value={currentSubProduct.ratings}
                onChange={(e) => handleSubProductChange('ratings', e.target.value)}
                type="number"
                InputProps={{
                  inputProps: { min: 0, max: 5 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFileInput
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <CustomFileInputLabel htmlFor="image-upload">
                {imageName ? `Image: ${imageName}` : 'Upload Image'}
              </CustomFileInputLabel>
            </Grid>
          </Grid>
          <SubmitButton
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Product'}
          </SubmitButton>
        </Box>
      </FormContainer>
    </Container>
  );
};

export default AddProduct;
