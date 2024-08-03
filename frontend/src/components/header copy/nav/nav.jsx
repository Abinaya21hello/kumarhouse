import React, { useEffect, useState } from "react";
import "./nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import axiosInstance from "../../../api/axiosInstance";

const Nav = ({ openNav, closeNav, userAuth }) => {
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAuth, setIsAuth] = useState(userAuth);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setIsOpenNav(openNav);
  }, [openNav]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("api/getProducts");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryHover = (category) => {
    setSelectedCategory(category);
  };

  const handleCategoryLeave = () => {
    setSelectedCategory(null);
  };

  const closeNavFun = () => {
    setIsOpenNav(false);
    closeNav();
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/");
  };

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
    closeNav();
  };

  useEffect(() => {
    axiosInstance
      .get("api/gettopnav")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const topNavData = response.data[0];
          setAddresses(topNavData.addresses || []);
          setEmail(topNavData.email || "");
          setPhone(topNavData.phone || "");
        } else {
          setAddresses([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, []);

  return (
    <>
      {isOpenNav && <div className="navbarOverlay" onClick={closeNav}></div>}
      <div
        className={`navContainer d-flex align-items-center ${
          isOpenNav ? "click" : ""
        }`}
      >
        <div className="container-fluid">
          <div className="row position-relative justify-content-between">
            <div className="col-sm-8 part2 position-static">
              <nav className={isOpenNav ? "open" : ""}>
                <ul className="list list-inline mb-0">
                  <li className="list-inline-item">
                    <Button>
                      <Link
                        to="/"
                        className={`navbar-link ${
                          activeLink === "/" ? "active" : ""
                        }`}
                        onClick={() => handleNavLinkClick("/")}
                      >
                        HOME
                      </Link>
                    </Button>
                  </li>

                  {loading ? (
                    <li className="list-inline-item">Loading...</li>
                  ) : (
                    categories.slice(0, 3).map((category) => (
                      <li
                        key={category._id}
                        className="list-inline-item navbar-item"
                        onMouseEnter={() => handleCategoryHover(category)}
                        onMouseLeave={handleCategoryLeave}
                      >
                        <Button>
                          <Link to="" className="categoryContainer navbar-link">
                            {category.category} <KeyboardArrowDownIcon />
                          </Link>
                        </Button>
                        {selectedCategory &&
                          selectedCategory._id === category._id && (
                            <div className="dropdown">
                              <div className="dropdown-content">
                                <div className="row">
                                  {category.models.map((model) => (
                                    <div key={model._id} className="col">
                                      <Link
                                        to={`products/${category._id}/models/${model._id}`}
                                        className="modelContainer dropdown-link fw-bold"
                                      >
                                        {model.mainProduct}
                                      </Link>
                                      <ul className="sub-dropdown ms-4">
                                        {model.subProduct.map((subProduct) => (
                                          <li
                                            key={subProduct._id}
                                            className="sub-dropdown-item mt-3"
                                          >
                                            <Link
                                              to={`product/${category._id}/models/${model._id}/subproducts/${subProduct._id}`}
                                              className="subProductContainer sub-dropdown-link fw-bold"
                                            >
                                              {subProduct.subproductname}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </li>
                    ))
                  )}

                  <li className="list-inline-item">
                    <Button>
                      <Link
                        to="/about"
                        className={`navbar-link ${
                          activeLink === "/about" ? "active" : ""
                        }`}
                        onClick={() => handleNavLinkClick("/about")}
                      >
                        ABOUT
                      </Link>
                    </Button>
                  </li>

                  <li className="list-inline-item">
                    <Button>
                      <Link
                        to="/product"
                        className={`navbar-link ${
                          activeLink === "/product" ? "active" : ""
                        }`}
                        onClick={() => handleNavLinkClick("/product")}
                      >
                        PRODUCTS
                      </Link>
                    </Button>
                  </li>

                  <li className="list-inline-item">
                    <Button>
                      <Link
                        to="/contact"
                        className={`navbar-link ${
                          activeLink === "/contact" ? "active" : ""
                        }`}
                        onClick={() => handleNavLinkClick("/contact")}
                      >
                        CONTACT
                      </Link>
                    </Button>
                  </li>

                  {windowWidth < 992 && isAuth ? (
                    <li className="list-inline-item">
                      <Button onClick={signOut}>
                        <LogoutOutlinedIcon /> Sign out
                      </Button>
                    </li>
                  ) : (
                    windowWidth < 992 && (
                      <li className="list-inline-item">
                        <Link to="/signIn" onClick={closeNav}>
                          <Button className="btn btn-g btn-lg">Sign In</Button>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>

            <div className="col-sm-2 part3 d-flex align-items-end">
              <div className="phNo d-flex align-items-center ml-auto">
                <span>
                  <HeadphonesOutlinedIcon />
                </span>
                <div className="info ml-3">
                  <h3 className="text-g mb-0">+91{phone}</h3>
                  <p className="mb-0">24/7 Support Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
