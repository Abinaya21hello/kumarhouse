import React, { useState, useEffect, useRef, useContext } from "react";
import SliderBanner from "./slider/index";
// import CatSlider from "../../components/catSlider";
import { client } from "../../clientaxios/Client";
import { useDispatch, useSelector } from 'react-redux'; // Import these if you're fetching data using Redux
import { Link } from 'react-router-dom'; // If navigating to product details
import { useParams } from 'react-router-dom';
import Banners from "../../components/banners";
import { Grid, Typography } from '@mui/material';

import "./style.css";
import Product from "../../components/product";
import Banner4 from "../../assets/images/banner4.jpg";

import Slider from "react-slick";
import TopProducts from "./TopProducts";

import { MyContext } from "../../App";
import CustomerReviews from "../../components/customerreviews/CustomerReviews";
import Service from "../../components/service/Service";

const Home = (props) => {
  const [prodData, setprodData] = useState(props.data);
  const [catArray, setcatArray] = useState([]);
  const [activeTab, setactiveTab] = useState();
  const [activeTabIndex, setactiveTabIndex] = useState(0);
  const [activeTabData, setActiveTabData] = useState([]);
  const { categoryName } = useParams();

  const [bestSells, setBestSells] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const productRow = useRef();
  const context = useContext(MyContext);

  var settings = {
    dots: false,
    infinite: context.windowWidth < 992 ? false : true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth < 992 ? false : true,
  };
  const productList = useSelector((state) => state.product);

  // State to hold popular products data
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    // Function to get popular products based on category name
    const getPopularProducts = (categoryName) => {
      if (productList.products) {
        // Filter products by category name and sort by popularity (e.g., by ratings or sales)
        const filteredProducts = productList.products
          .flatMap(product => product.models.flatMap(model => model.subProduct))
          .filter(subProduct => subProduct.category === categoryName) // Adjust this based on your data structure
          .sort((a, b) => b.rating - a.rating) // Sorting example, adjust as per your logic

        // Set popular products state
        setPopularProducts(filteredProducts);
      }
    };

    // Call the function to fetch popular products
    getPopularProducts(categoryName);
  }, [productList.products, categoryName]);
  return (
    <div style={{ display: "block" }}>
      <SliderBanner />
      {/* <CatSlider data={prodData} /> */}

      <Banners />
      <section className="topProductsSection">
        <div className="container-fluid">
          <TopProducts title="Top Selling" />

          {/* <div className='col'>
                            <TopProducts title="Trending Products" />
                        </div>

                        <div className='col'>
                            <TopProducts title="Recently added" />
                        </div>

                        <div className='col'>
                            <TopProducts title="Top Rated" />
                        </div> */}
        </div>
      </section>
   <section>
   <Service/>
   </section>

      
    

      <section style={{backgroundColor:'',height:'100%'}}>
        <CustomerReviews />
      </section>
    </div>
  );
};

export default Home;