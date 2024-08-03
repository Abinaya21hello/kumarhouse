import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "./index.css";
import Button from "@mui/material/Button";
import CountdownTimer from "../../../components/CountdownTimer/CountdownTimer";

import { MyContext } from "../../../App";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Confetti from "js-confetti";
import axiosInstance from "../../../api/axiosInstance";

const useStyles = makeStyles((theme) => ({
  offerCard: {
    backgroundColor: "#3BB77E",
    borderRadius: "50%",
    padding: theme.spacing(2),
    textAlign: "center",
    marginTop: theme.spacing(2),
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "250px",
    height: "250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  offerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  slideInfo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    textAlign: "center",
    padding: theme.spacing(2),
    borderRadius: "20px",
  },
}));

const HomeSlider = () => {
  const context = useContext(MyContext);
  const classes = useStyles();
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  const handleShopButtonClick = () => {
    // const confetti = new Confetti();
    // confetti.addConfetti();
    navigate("/product");
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: context.windowWidth > 992 ? true : false,
    autoplay: true,
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axiosInstance.get("api/getOffer");
        setSlides(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSlides();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <section className="homeSlider">
      <div className="container-fluid position-relative">
        {slides.length > 0 ? (
          <Slider {...settings} className="home_slider_Main">
            {slides.map((slide) => {
              const formattedDate = new Date(slide.expireDate)
                .toISOString()
                .split("T")[0];
              return (
                <div className="item" key={slide._id}>
                  <div className="homeSlider_image">
                    <img
                      src={slide.image}
                      className="w-100 homeSlider_img"
                      alt={slide.title}
                    />
                  </div>
                  <div className="info">
                    <Typography variant="h2" className="mb-2">
                      {slide.title}
                    </Typography>
                    <Typography variant="body1">
                      Sign up for the daily newsletter
                    </Typography>
                    <CountdownTimer targetDate={formattedDate} />
                    <div className="shopbutton">
                      <Button onClick={handleShopButtonClick} className="bg-g">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          <Typography variant="h6" align="center">
            Loading slides...
          </Typography>
        )}
      </div>
    </section>
  );
};

export default HomeSlider;
