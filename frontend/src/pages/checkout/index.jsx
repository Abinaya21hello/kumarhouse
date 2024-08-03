import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography ,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Modal,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useMediaQuery } from "@mui/material";
import { MyContext } from "../../App";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import Confetti from "js-confetti";
import "./checkout.css"; // Import the CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TermsAndCondition from "../termsAndConditions/TermsAndCondition";

import { Country, State } from "country-state-city";
import axiosInstance from "../../api/axiosInstance";

const steps = ["Shipping Address", "Review Order", "Payment"];

const Checkout = () => {
  const location = useLocation();
  const { cartItems, userId, userName, subtotal } = location.state || {};
  const [cartGrams, setCartGrams] = useState([]);

  console.log(cartGrams);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("TN");

  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pincode: "",
    street: "",
    city: "",
    state: selectedState,
    country: selectedCountry,
  });
  const [shippingFee, setShippingFee] = useState(40);
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '60%', lg: '500px' },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowX :'hidden'
  };
  

  //gpay model
  const [openGpy , setOpenGpay] = React.useState(false);
  const handleGpayOpen = () => setOpenGpay(true);
  const handleGpayClose = () => setOpenGpay(false);

  const navigate = useNavigate();

  const userLocalId = localStorage.getItem("userId");
  if (!userLocalId) {
    alert("User not found. Please log in.");
    navigate("/signIn");
    return;
  }

  //shipping and grams
  useEffect(() => {
    const grams = cartItems.map((item) => item.grams * item.quantity);
    const gramsTotal = grams.reduce((cum, add) => cum + add, 0);
    const gramsAbove1000 = grams.filter((gram) => gram >= 1000);

    // Set shipping fee based on state
    if (selectedState.trim() === "TN") {
      setShippingFee(40);
    } else {
      setShippingFee(80);
    }

    // Check if any item has grams 1000 or above or if total grams is above 999
    if (gramsAbove1000.length > 0 || gramsTotal > 999) {
      if (selectedState.trim() !== "TN") {
        setShippingFee(100);
      } else {
        setShippingFee(80);
      }
    }
  }, [cartItems, formFields]);

  useEffect(() => {
    // Fetch countries from the data set
    const countryData = Country.getAllCountries();
    setCountries(countryData);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      // Fetch states based on selected country code
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
    }
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    setSelectedState("");
    setFormFields((prevFields) => ({
      ...prevFields,
      country: countryCode,
    }));
  };
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setFormFields((prevFields) => ({
      ...prevFields,
      state: event.target.value,
    }));
  };
  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const context = useContext(MyContext);

  useEffect(() => {
    if (cartItems.length > 3) {
      setShippingFee(100);
    }
  }, [cartItems]);

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    return nameRegex.test(name);
  };

  const validateStreet = (street) => {
    const streetRegex =  /^[a-zA-Z0-9\s',-]*$/;
    return streetRegex.test(street);
  };
  const validateCity = (city) => {
    const cityRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    return cityRegex.test(city);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[1-9][0-9]{9,11}$/;
    return phonePattern.test(phone);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePincode = (pincode) => {
    const pincodePattern = /^[0-9]{6}$/;
    return pincodePattern.test(pincode);
  };

  const handleNext = () => {
    let {
      firstName,
      lastName,
      phone,
      email,
      pincode,
      street,
      city,
      state,
      country,
    } = formFields;

    firstName = firstName.trim();
    lastName = lastName.trim();
    phone = phone.trim();
    email = email.trim();
    pincode = pincode.trim();
    street = street.trim();
    city = city.trim();
    state = state.trim();
    country = country.trim();

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !pincode ||
      !street ||
      !city ||
      !state ||
      !country
    ) {
      console.log(
        firstName,
        lastName,
        phone,
        email,
        pincode,
        street,
        city,
        state,
        country
      );
      // alert("All fields are required");
      alert("All fields are required");
      return false;
    }

    console.log(
      firstName,
      lastName,
      phone,
      email,
      pincode,
      street,
      city,
      state,
      country
    );

    if (!validateName(firstName)) {
      alert(
        "Invalid first name.  Special characters and numbers are not allowed."
      );
      return false;
    }

    if (!validateName(lastName)) {
      alert(
        "Invalid last name.  Special characters and numbers are not allowed."
      );
      return false;
    }

    if (!validatePhone(phone)) {
      alert(
        "Invalid phone number. Please enter a 10-digit phone number."
      );
      return false;
    }

    if (!validateEmail(email)) {
      alert("Invalid email address. Please enter a valid email.");
      return false;
    }

    if (!validatePincode(pincode)) {
      alert("Invalid pincode. Please enter a 6-digit pincode.");
      return false;
    }

    if (!validateStreet(street)) {
      alert(
        "Invalid street address. Special characters and numbers are not allowed."
      );
      return false;
    }
    if (!validateCity(city)) {
      alert(
        "Invalid city address. Special characters and numbers are not allowed."
      );
      return false;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const calculateTotalAmount = () => {
    return (
      cartItems.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ) + shippingFee
    );
  };

  useEffect(() => {
    if (paymentMethod === "razorpay") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay script loaded.");
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script.");
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod]);

  const [transactionId, setTransactionId] = useState('');

  const createOrderPayload = () => {
    const totalAmount = calculateTotalAmount();
    const {
      firstName,
      lastName,
      phone,
      email,
      pincode,
      street,
      city,
      state,
      country,
    } = formFields;
  
    return {
      userId: userId,
      users: [
        {
          userName: userName,
          email: email,
          phone: phone,
        },
      ],
      products: cartItems.map((item) => ({
        productId: item.productId,
        modelId: item.modelId,
        subProductId: item.subProductId,
        ProductImage: item.image,
        ProductName: item.subproductname,
        currentPrice: item.price,
        grams: item.grams,
        quantity: item.quantity,
      })),
      totalAmount,
      currency: 'INR',
      deliveryAddress: {
        street: street,
        district: city,
        state: state,
        country: country,
        pincode: pincode,
      },
      method: paymentMethod,
    };
  };
  
  const placeOrder = async () => {
    if (termsAccepted) {
      const orderPayload = createOrderPayload();
  
      if (paymentMethod === 'razorpay') {
        try {
          const order = await axiosInstance.post('api/create-order', orderPayload);
          const { data } = order;
  
          const options = {
            key: 'rzp_live_GpzdR3hvYUKExV',
            amount: data.totalAmount * 100,
            currency: data.currency,
            name: 'Kumar Herbals',
            description: 'Online Transaction',
            order_id: data.id,
            handler: async function (response) {
              const paymentData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };
  
              try {
                const result = await axiosInstance.post('api/verify-payment', paymentData);
                // const confetti = new Confetti();
                // confetti.addConfetti();
                alert('Payment success!');
                handleRemoveFromCart(userId);
                navigate(`/success/${response.data.order._id}`);
              } catch (error) {
                alert('Payment verification failed');
              }
            },
            prefill: {
              name: userName,
              email: orderPayload.email,
              contact: orderPayload.phone,
            },
            theme: {
              color: '#32de84',
            },
          };
  
          if (window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
          } else {
            console.error('Razorpay SDK is not loaded.');
          }
        } catch (error) {
          console.error('Error creating order:', error);
        }
      } else if (paymentMethod === 'cod') {
        try {
          const response = await axiosInstance.post('api/create-order', orderPayload);
          // const confetti = new Confetti();
          // confetti.addConfetti();
          // alert('Payment success!');
          handleRemoveFromCart(userId);
          alert('Order placed successfully!');
          navigate(`/success/${response.data.order._id}`);
        } catch (error) {
          console.error('Error creating COD order:', error);
        }
      } else if (paymentMethod === 'gpay') {
        handleGpayOpen();
      } else {
        console.error('Invalid payment method selected.');
      }
    } else {
      alert('You must accept the terms and conditions to place an order.');
    }
  };
  const changeInput = (e) => {
    const { name, value } = e.target;

    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleRemoveFromCart = (uId) => {
    try {
      const response = axiosInstance.delete(`api/delete-cart-item/${uId}`);
      console.log(response.data.message);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };
 
 const handleGpayButton = async (e) => {
    e.preventDefault();

    // Validate transactionId
    if (!transactionId || transactionId.trim().length === 0) {
      alert("Please enter transaction ID");
      return;
    }

    const trimmedTransactionIdLength = transactionId.trim().length;
    if (trimmedTransactionIdLength < 12 || trimmedTransactionIdLength > 25) {
      alert("Invalid transaction ID");
      return;
    }

    // Create order payload and add transactionId
    const orderPayload = createOrderPayload();
    orderPayload.transactionId = transactionId;

    try {
      const response = await axiosInstance.post(
        "api/create-order",
        orderPayload
      );
      alert("Transcation id successfully sent!");

      // Handle cart removal and order placement success
      await handleRemoveFromCart(userId);
      alert("Order placed successfully!");

      // Navigate to success page
      navigate(`/success/${response.data.order._id}`);
    } catch (error) {
      console.error("Error creating GPay order:", error);
      alert("There was an error processing your payment. Please try again.");
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form w-100 mt-4 shadow">
            <h>Shipping Address</h>
            <div className="form-group mb-3 mt-4">
              <TextField
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                className="w-100"
                value={formFields.firstName}
                onChange={changeInput}
                name="firstName"
                inputProps={{ maxLength: 20 }}
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                className="w-100"
                value={formFields.lastName}
                onChange={changeInput}
                name="lastName"
                inputProps={{ maxLength: 20 }}
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                className="w-100"
                value={formFields.phone}
                onChange={changeInput}
                name="phone"
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                className="w-100"
                value={formFields.email}
                onChange={changeInput}
                name="email"
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="outlined-basic"
                label="Pincode"
                variant="outlined"
                className="w-100"
                value={formFields.pincode}
                onChange={changeInput}
                name="pincode"
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="outlined-basic"
                label="Street"
                variant="outlined"
                className="w-100"
                value={formFields.street}
                onChange={changeInput}
                name="street"
                inputProps={{ maxLength: 100 }}
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="outlined-basic"
                label="City"
                variant="outlined"
                className="w-100"
                value={formFields.city}
                onChange={changeInput}
                name="city"
                inputProps={{ maxLength: 15 }}
              />
            </div>
            <div className="form-group mb-3">
              <TextField
                id="country"
                label="country"
                variant="outlined"
                fullWidth
                required
                select
                value={selectedCountry}
                onChange={handleCountryChange}
                SelectProps={{
                  native: true,
                }}
                style={{ marginBottom: "10px" }}
              >
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </TextField>
              <TextField
                id="state"
                label="State"
                variant="outlined"
                fullWidth
                required
                select
                value={selectedState}
                onChange={handleStateChange}
                SelectProps={{
                  native: true,
                }}
                style={{ marginBottom: "10px" }}
              >
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </TextField>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form w-95 mt-4 shadow reduced-font-size">
            <h3>Review Order</h3>
            <div className="cartWrapper mt-4">
              <div className="table-responsive">
                <table className="table reduced-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems &&
                      cartItems.map((item, index) => (
                        <tr key={index}>
                          <td width="50%">
                            <div className="d-flex align-items-center">
                              <div className=" img">
                                <Link to={`/product/${item.id}`}>
                                  <img
                                    src={item.image}
                                    alt={item.subproductname}
                                    className="product-image"
                                  />
                                </Link>
                              </div>
                              <div className="checkOutInfo info">
                                {/* /sub-product/${item.productId}/models/${item.modelId}/sub/${item.subProductId} */}
                                <Link
                                  to={`/product/${item.productId}/models/${item.modelId}/subproducts/${item.subProductId} `}
                                >
                                  <h5>{item.subproductname}</h5>
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td width="20%">
                            <h6>
                              Rs: {item.price ? parseInt(item.price) : "N/A"}
                            </h6>
                          </td>
                          <td width="20%">
                            <h6>{item.quantity}</h6>
                          </td>
                          <td width="20%">
                            <h5>
                              Rs:{" "}
                              {parseInt(item.price) * parseInt(item.quantity)}
                            </h5>
                          </td>
                          {/* <td width="10%">
                            <Button
                              onClick={() =>
                                handleRemoveFromCart(item.productId)
                              }
                            >
                              Remove
                            </Button>
                          </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form w-75 mt-4 shadow">
            <h3>Payment</h3>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >

              {/* this code is for able code */}
              {/* <FormControlLabel
      value="razorpay"
      control={<Radio  />}
      label="Pay with Razorpay / Online Payment"
    /> */}
         <FormControlLabel
      value=""
      control={<Radio disabled />}
      label="Pay with Razorpay / Online Payment(Currently Unavailable)"
      disabled
    />
                 <FormControlLabel
                value="gpay"
                control={<Radio />}
                label="Pay with Gpay"
              />
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>

            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={handleCheckboxChange}
                  name="terms"
                />
              }
              label={
                <span>
                  I accept the{" "}
                  <span
                    onClick={handleTermsClick}
                    style={{ color: "green", cursor: "pointer" }}
                  >
                    TERMS AND CONDITIONS
                  </span>
                </span>
              }
            />

            <Button
              className="btn-g btn-lg mt-3 d-block"
              onClick={placeOrder}
              // disabled={!termsAccepted}
            >
              Place Order
            </Button>

            <Modal open={showTermsModal} onClose={closeTermsModal}>
              <div
                style={{
                  padding: "20px 20px 0px 20px",
                  backgroundColor: "white",
                  margin: "30px auto",
                  maxWidth: "600px",
                  maxHeight: "650px",
                  borderRadius: "8px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  position: "relative",
                }}
              >
                <h2 className="text-center fw-bold">Terms & Conditions</h2>
                <TermsAndCondition />
                <div
                  style={{
                    position: "sticky",
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "white",
                    zIndex: 1000,
                  }}
                >
                  <Button
                    onClick={closeTermsModal}
                    style={{
                      color: "green",
                      backgroundColor: "white",
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Modal>

            {/* gpayModel */}
            <Modal
        open={openGpy}
        onClose={handleGpayClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          <div style={{position:"absolute", top:"5px", right:"5px", cursor:"pointer"}}>
              <CancelIcon onClick={handleGpayClose} />
          </div>
          
          <Typography id="modal-modal-title"  variant="h6" component="h2" sx={{ textAlign: 'center' }}>
      <img src="\assets\img\phonepay.jpeg" alt="phonepay qrscanner" style={{ width: '100%', maxWidth: '400px', height: 'auto' }} />
    </Typography>
          <TextField id="outlined-basic" value={transactionId} onChange={(e)=>{setTransactionId(e.target.value)}} className="mt-5 w-100" label="Transaction Id" variant="outlined" />
          <Button variant="contained" onClick={handleGpayButton} color="success" className="mt-2">Submit</Button>
        </Box>
      </Modal>
          </div>
        );
      default:
        return "Unknown step";
    }
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <section className="cartSection mb-5 checkoutPage">
      <div className="container">
        <form>
          <div className="row">
            <div className="col-md-8">
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          fontSize: isSmallScreen ? "1.5rem" : "2rem", // Adjust the font size based on screen size
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box>{getStepContent(activeStep)}</Box>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  style={{backgroundColor:"#508D4E", color:"white", fontSize:"1.1rem"}}  >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {activeStep !== steps.length - 1 ? (
                  <Button onClick={handleNext} variant="contained" style={{backgroundColor:"green" ,fontSize:"1.1rem"}}>Next</Button>
                ) : null}
              </Box>
            </div>
            <div className="col-md-4 cartRightBox pt-7">
              <div className="card p-4 ">
                <div className="d-flex justify-content-between mb-4">
                  <div>
                    <h5 className="mb-0 text-light fs-3">Subtotal : </h5>
                    <p className="text-light" style={{ fontSize: "12px" }}>
                      (include shipping fee : {shippingFee})
                    </p>
                  </div>
                  <h3 className="ml-auto mb-0 font-weight-bold">
                    <span className="text-light">Rs: {subtotal}</span>
                  </h3>
                </div>
                {/* <div className="d-flex justify-content-between mb-4">
                  <h5 className="mb-0 text-light">Estimated Shipping :</h5>
                  <h3 className="mb-0 ml-auto">
                    <span className="text-light"> Rs : {shippingFee}</span>
                  </h3>
                </div> */}
                <hr />
                <div className="d-flex justify-content-between">
                  <h5 className="mb-0 text-light ">Total :</h5>
                  <h2 className="ml-auto mb-0 fw-bolder">
                    <span className="text-light">
                      Rs: {subtotal + shippingFee}
                    </span>
                  </h2>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Checkout;
