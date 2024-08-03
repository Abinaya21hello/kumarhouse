import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '../../api/axiosInstance';

const CategoryPage = () => {
  const { id, productName } = useParams();
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`categories/${id}/${productName}`);
        setProductDetails(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id, productName]);

  const handleMainProductClick = async (modelId) => {
    try {
      const response = await axiosInstance.get(`categories/${id}/${productName}/models/${modelId}`);
      // Handle response to show sub-products or update state accordingly
      console.log('Main product clicked:', response.data);
    } catch (error) {
      console.error('Error fetching model details:', error);
    }
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{productName}</h1>
      <ul>
        {productDetails.models.map((model) => (
          <li key={model._id}>
            <button onClick={() => handleMainProductClick(model._id)}>
              {model.mainProduct}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
