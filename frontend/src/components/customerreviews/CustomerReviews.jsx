import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SlickSlider from "react-slick";
import { fetchReviews } from "../../redux/actions/reviewActions";
import styled from "styled-components";
import QuoteImg from "../../assets/review/quote-icon.png"; // Ensure the path to the image is correct
import "./customer.css"; // Ensure this file exists and is correctly imported
import { Typography } from "@mui/material";

const BoxContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 10px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  height: 800px; /* Set the desired height */
  overflow: hidden;
`;

const CustomerCardContainer = styled.div`
  max-width: 78%;
  height: 600px;
  text-align: center;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 1px 1px 1px 1px #149e9e80;
  position: relative;
  margin: 20px;
  padding: 125px 50px 30px;
  overflow: hidden;

  @media (max-width: 700px) {
    max-width: 95%;
    height: auto;
    padding: 100px 20px 20px;
  }

  @media (min-width: 1000px) {
    height: 500px; // Adjust the height as needed
    padding: 100px 50px 30px; // Adjust the padding as needed
  }
`;

const CustomerQuoteContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.greenish};
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  padding: 30px 50px 50px 30px;
  border-radius: 0 0 114px 0;
`;

const CustomerQuote = styled.img`
  width: 40px;
  height: 40px;
`;

const CustomerLine1 = styled.span`
  width: 8px;
  height: 100px;
  display: inline-block;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.blackish} 50%,
    ${({ theme }) => theme.colors.greenish} 50%
  );
  position: absolute;
  top: 10%;
  right: 0;
`;

const CustomerLine2 = styled(CustomerLine1)`
  top: auto;
  right: auto;
  bottom: 10%;
  left: 0;
`;

const CustomerTile = styled.h3`
  color: ${({ theme }) => theme.colors.greenish};
  text-transform: uppercase;
`;

const CustomerDescription = styled.p`
  padding: 10px 5px;
  color: #b1b3b2;

  @media (max-width: 700px) {
    font-size: 14px;
  }
`;

const CustomerProfilePic = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 130px;
  object-fit: cover;
  padding: 10px 5px;
  margin: 0 auto; /* Center the image horizontally */
`;

const CustomerName = styled.h2`
  text-transform: uppercase;

  @media (max-width: 700px) {
    font-size: 18px;
  }
`;

const CustomerDesignation = styled.p`
  text-transform: uppercase;
  color: #b1b3b2;

  @media (max-width: 700px) {
    font-size: 12px;
  }
`;

const CustomerCard = ({ review }) => {
  const { title, reviews, image, name, district, stars } = review;

  return (
    <CustomerCardContainer>
      <CustomerQuoteContainer>
        <CustomerQuote src={QuoteImg} alt="quote-pic" />
      </CustomerQuoteContainer>
      <CustomerLine1 />
      <CustomerLine2 />
      <CustomerTile>{title}</CustomerTile>
      <CustomerProfilePic src={image} alt="profile-pic" />
      <CustomerName>{name}</CustomerName>
      <CustomerDesignation>{district}</CustomerDesignation>
      <CustomerDescription>{reviews}</CustomerDescription>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            style={{
              color: i < stars ? "#FFD700" : "#b1b3b2",
              fontSize: "24px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    </CustomerCardContainer>
  );
};

const CustomerContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 20px auto;
`;

const CustomerHeadingOne = styled.h2`
  color: ${({ theme }) => theme.colors.greenish};
  text-align: center;
`;

const CustomerHeadingTwo = styled.h1`
  margin: 8px 5px;
  text-align: center;
`;

const CustomerLine = styled.span`
  width: 50px;
  height: 5px;
  background-color: ${({ theme }) => theme.colors.greenish};
  text-align: center;
  display: block;
  margin: 0 auto;
`;

const CustomerCardList = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const CustomerReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.reviews);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchReviews());
    }
  }, [dispatch, isAuthenticated]);

  const customerSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (!isAuthenticated) {
    return (
      <Typography
        variant="h4"
        align="center"
        color="textSecondary"
        sx={{ padding: "10px" }}
      >
        Please log in to see customer reviews.
      </Typography>
    );
  }

  if (loading) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        Loading reviews...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        Error fetching reviews: {error}
      </Typography>
    );
  }

  return (
    <BoxContainer>
      <CustomerContainer>
        <CustomerHeadingOne>Testimonials</CustomerHeadingOne>
        <CustomerHeadingTwo>What Our Customers Say</CustomerHeadingTwo>
        <CustomerLine />
        <CustomerCardList>
          {reviews.length > 0 ? (
            reviews.length === 1 ? (
              <CustomerCard review={reviews[0]} />
            ) : (
              <SlickSlider {...customerSliderSettings}>
                {reviews.map((review, index) => (
                  <CustomerCard review={review} key={index} />
                ))}
              </SlickSlider>
            )
          ) : (
            <Typography variant="h6" align="center" color="textSecondary">
              No reviews available.
            </Typography>
          )}
        </CustomerCardList>
      </CustomerContainer>
    </BoxContainer>
  );
};

export default CustomerReviews;
