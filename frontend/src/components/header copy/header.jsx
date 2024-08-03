import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../header copy/header.css";
import Logo from "../../assets/images/logo/Kumar Herbals - Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import Select from "../selectDrop/select";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import IconCompare from "../../assets/images/icon-compare.svg";
import IconHeart from "../../assets/images/icon-heart.svg";
import IconCart from "../../assets/images/icon-cart.svg";
import IconUser from "../../assets/images/icon-user.svg";
import Button from "@mui/material/Button";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { HiShoppingCart } from "react-icons/hi";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Nav from "./nav/nav";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/userActions.js";
import { client } from "../../clientaxios/Client.jsx";
// import CountryStateDropdown from "../countrystateprovider/CountryStateDropdown.jsx";
import axiosInstance from "../../api/axiosInstance.js";

// import { getCartItems, getwishItems } from "../../api/axiosInstance.js";

// import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  fetchWishItems,
} from "../../redux/actions/cartItemActions";
const Header = (props) => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [isOpenAccDropDown, setIsOpenAccDropDown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenSearch, setOpenSearch] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);

  const [categories, setCategories] = useState([]);
  const headerRef = useRef();
  const searchInput = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, cartItems, wishItems } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    cartItems: state.cartItemReducer.cartItems || [],
    wishItems: state.cartItemReducer.wishItems || [],
  }));

  const [userAuth, setUserAuth] = useState(false);

  // const countryList = [
  //   { id: 1, name: "USA" },
  //   { id: 2, name: "Canada" },
  //   { id: 3, name: "UK" },
  //   // Add more countries as needed
  // ];

  useEffect(() => {
    setUserAuth(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      setUserAuth(true);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("api/categories"); // Adjust the URL according to your API
        setCategories(response.data || []); // Ensure categories is an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set categories to an empty array on error
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        headerRef.current.classList.add("fixed");
      } else {
        headerRef.current.classList.remove("fixed");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  const signOut = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    setUserAuth(false);
    navigate("/");
  };

  const openSearch = () => {
    setOpenSearch(true);
    searchInput.current.focus();
  };

  const closeSearch = () => {
    setOpenSearch(false);
    searchInput.current.blur();
    searchInput.current.value = "";
  };

  const openNav = () => setIsOpenNav(true);
  const closeNav = () => {
    setIsOpenNav(false);
    setIsOpenAccDropDown(false);
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchCartItems(userId));
      dispatch(fetchWishItems(userId));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   // Retrieve counts from localStorage on component mount
  //   const cartItemCount = localStorage.getItem('cartItemCount');
  //   const wishItemCount = localStorage.getItem('wishItemCount');

  //   // Update Redux store if counts are available
  //   if (cartItemCount !== null) {
  //     dispatch({ type: "FETCH_CART_ITEMS", payload: Array(Number(cartItemCount)).fill({}) });
  //   }
  //   if (wishItemCount !== null) {
  //     dispatch({ type: "FETCH_WISH_ITEMS", payload: Array(Number(wishItemCount)).fill({}) });
  //   }
  // }, [dispatch]);
  return (
    <>
      <div className="headerWrapper" ref={headerRef}>
        <header>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-2 part1 d-flex align-items-center">
                <Link to="/">
                  <img
                    style={{ width: "140px", height: "auto" }}
                    src={Logo}
                    className="logo"
                  />
                </Link>
                {windowWidth < 992 && (
                  <div className="ml-auto d-flex align-items-center">
                    <div className="navbarToggle mr-0" onClick={openSearch}>
                      <SearchIcon />
                    </div>
                    <ul className="list list-inline mb-0 headerTabs pl-0 mr-4">
                      <li className="list-inline-item">
                        <span>
                          <Link to={"/cart"}>
                            {" "}
                            <img src={IconCart} />
                            {/* <span className='badge bg-success rounded-circle'>
                                                            {cartItems.length}
                                                        </span> */}
                          </Link>
                        </span>
                      </li>
                    </ul>
                    <div className="navbarToggle mr-2" onClick={openNav}>
                      <MenuIcon />
                    </div>

                    {isAuthenticated && (
                      <div
                        className="myAccDrop"
                        onClick={() => setIsOpenAccDropDown(!isOpenAccDropDown)}
                      >
                        <PersonOutlineOutlinedIcon />
                      </div>
                    )}

                    {/* <CountryStateDropdown/> */}
                  </div>
                )}
              </div>
              <div className="col-sm-5 part2" style={{ alignSelf: "center" }}>
                <div
                  className={`headerSearch d-flex align-items-center ${
                    isOpenSearch ? "open" : ""
                  }`}
                >
                  {windowWidth < 992 && (
                    <div className="closeSearch" onClick={closeSearch}>
                      <ArrowBackIosIcon />
                    </div>
                  )}
                  <Select
                    data={categories}
                    placeholder={"All Categories"}
                    icon={false}
                  />
                  <div className="search">
                    <input
                      type="text"
                      placeholder="Search for items..."
                      ref={searchInput}
                    />
                    <SearchIcon className="searchIcon cursor" />
                  </div>
                </div>
              </div>
              <div className="col-sm-5 d-flex part3 res-hide">
                <div className="ml-auto d-flex align-items-center">
                  {/* <div className="countryWrapper">
                    <CountryStateDropdown />
                  </div> */}
                  <ClickAwayListener
                    onClickAway={() => setIsOpenDropDown(false)}
                  >
                    <ul className="list list-inline mb-0 headerTabs">
                      {/* <li className="list-inline-item">
                        <span>
                          <img src={IconCompare} />
                          <span className="badge bg-success rounded-circle">
                            3
                          </span>
                          Compare
                        </span>
                      </li> */}
                      <li className="list-inline-item me-5">
                        <span>
                          <Link to={"/wishlist"}>
                            <img src={IconHeart} alt="Wishlist" />
                            <span className="badge bg-success rounded-circle">
                              {wishItems.length || 0}
                            </span>
                            Wishlist
                          </Link>
                        </span>
                      </li>
                      <li className="list-inline-item me-5">
                        <span>
                          <Link to={"/cart"}>
                            <img src={IconCart} alt="Cart" />
                            <span className="badge bg-success rounded-circle">
                              {cartItems.length || 0}
                            </span>
                            Cart
                          </Link>
                        </span>
                      </li>
                      {isAuthenticated || userAuth ? (
                        <li className="list-inline-item">
                          <span
                            onClick={() => setIsOpenDropDown(!isOpenDropDown)}
                          >
                            <img src={IconUser} />
                            Account
                          </span>
                          {isOpenDropDown && (
                            <ul className="dropdownMenu">
                              <li>
                                <Button className="align-items-center">
                                  <Link to="/dash">
                                    <Person2OutlinedIcon /> My Account
                                  </Link>
                                </Button>
                              </li>
                              {/* <li>
                                <Button>
                                  <LocationOnOutlinedIcon /> Order Tracking
                                </Button>
                              </li> */}

                              <li>
                                <Button className="align-items-center">
                                  <Link to="/orders">
                                    <LocationOnOutlinedIcon /> Order Tracking
                                  </Link>
                                </Button>
                              </li>
                              {/* <li>
                                <Button>
                                  <FavoriteBorderOutlinedIcon /> My Wishlist
                                </Button>
                              </li> */}
                              <li>
                                <Button className="align-items-center">
                                  <Link to="/wishlist">
                                    <FavoriteBorderOutlinedIcon /> My Wishlist
                                  </Link>
                                </Button>
                              </li>

                              <li>
                                <Button className="align-items-center">
                                  <Link to="/cart">
                                    <HiShoppingCart /> My Cart
                                  </Link>
                                </Button>
                              </li>

                              {/* <li>
                                <Button>
                                  <SettingsOutlinedIcon /> Setting
                                </Button>
                              </li> */}
                              <li>
                                <Button onClick={signOut}>
                                  <LogoutOutlinedIcon /> Sign out
                                </Button>
                              </li>
                            </ul>
                          )}
                        </li>
                      ) : (
                        <li className="list-inline-item">
                          <Link to={"/signIn"}>
                            <Button className="btn btn-g">Sign In</Button>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </ClickAwayListener>
                </div>
              </div>
            </div>
          </div>
        </header>
        <Nav data={props.data} openNav={isOpenNav} closeNav={closeNav} />
      </div>
      <div className="afterHeader"></div>
      {isOpenAccDropDown && (
        <>
          <div className="navbarOverlay" onClick={closeNav}></div>
          <ul className="dropdownMenu dropdownMenuAcc" onClick={closeNav}>
            <li>
              <Button className="align-items-center">
                <Link to="/dash">
                  <Person2OutlinedIcon /> My Account
                </Link>
              </Button>
            </li>
            {/* <li>
              <Button className="align-items-center">
                <Link to="">
                  {" "}
                  <img src={IconCompare} />
                  Compare
                </Link>
              </Button>
            </li> */}
            <li>
              <Button className="align-items-center">
                <Link to="">
                  {" "}
                  <img src={IconCart} />
                  Cart
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link to="/">
                  <LocationOnOutlinedIcon /> My Orders
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link to="/wishlist">
                  <FavoriteBorderOutlinedIcon /> My Wishlist
                </Link>
              </Button>
            </li>
            {/* <li>
              <Button>
                <Link to="">
                  <SettingsOutlinedIcon /> Setting
                </Link>
              </Button>
            </li> */}
            <li>
              <Button onClick={signOut}>
                <Link to="">
                  <LogoutOutlinedIcon /> Sign out
                </Link>
              </Button>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default Header;
