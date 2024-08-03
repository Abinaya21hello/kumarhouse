import React, {
  useEffect,
  useState,
  createContext,
  lazy,
  Suspense,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import SubProduct from "./components/product/Productpage";
// import ProductList from "./pages/Products/ProdcutList";
// import ModelProduct from "./pages/Products/ModelProducts/ModelProduct";
import Header from "./components/header copy/header";
import Footer from "./components/footer/footer";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";
// import DetailsPage from "./pages/Details";
import Checkout from "./pages/checkout";
import Cart from "./pages/cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Wishlist from "./pages/wishlist/Wishlist";

// import Forgot from "./pages/forgotpassword/Forgot";
import OffersPage from "./components/CountdownTimer/Offerpage";
import CustomerReviews from "./components/customerreviews/CustomerReviews";
import Contact from "./pages/contact/Contact";
import PasswordUpdateForm from "./pages/Dashboard/Pages/Userprofile/UserChangePassword.jsx";
import CategoryPage from "./pages/categorypage/Categorypage";
import WhatsApp from "./components/whatsapp/WhatsApp";
// import Product from './'

import FloatingMailIcon from "./components/email floating icon/Floating";

// import Loader from "./Loader";
import ImageLoader from "./ImageLoader/ImageLoader";
import LogoImage from "../src/assets/images/logo/Kumar Herbals - Logo.png";
// Dashboard
import Dashboard from "./pages/Dashboard/Pages/Dashboarduser/UserDashboard";
import Profileforuser from "./pages/Dashboard/Pages/Userprofile/UserProfile";
import Wishlistforuser from "./pages/Dashboard/Pages/Wishlists/Wishlists";
import Dashboardforuser from "./pages/Dashboard/Pages/Dashboarduser/UserDashboard";
import OrderHistory from "./pages/Dashboard/Pages/OrderHistory/OrderHistory";
import Refundforuser from "./pages/Dashboard/Pages/Refund/Refund";
import FooterPrivacy from "./pages/privacypolicy/FooterPrivacy";
import Footerterms from "./pages/termsAndConditions/Footerterms";
const MyContext = createContext();

const LazyHome = lazy(() => import("./pages/Home/index"));
const LazyAbout = lazy(() => import("./pages/About/index"));
const LazyListing = lazy(() => import("./pages/Listing"));
const LazyNotFound = lazy(() => import("./pages/NotFound"));
// const LazyDetailsPage = lazy(() => import("./pages/Details"));
const LazyCheckout = lazy(() => import("./pages/checkout"));
const LazyCart = lazy(() => import("./pages/cart"));
const LazySignIn = lazy(() => import("./pages/SignIn"));
const LazySignUp = lazy(() => import("./pages/SignUp"));
const LazyWishlist = lazy(() => import("./pages/wishlist/Wishlist"));
const LazyForgot = lazy(() => import("./pages/forgotpassword/Forgot"));
const LazyOffersPage = lazy(() =>
  import("./components/CountdownTimer/Offerpage")
);
const LazyCustomerReviews = lazy(() =>
  import("./components/customerreviews/CustomerReviews")
);
const LazyContact = lazy(() => import("./pages/contact/Contact"));
// const LazyDashboard = lazy(() => import("./pages/profiledashboard/Dashboard"));
const LazyCategoryPage = lazy(() =>
  import("./pages/categorypage/Categorypage")
);
const LazyWhatsApp = lazy(() => import("./components/whatsapp/WhatsApp"));

const LazyProduct = lazy(() => import("./components/product/Product"));

const LazySubProductDetails = lazy(() =>
  import("./pages/products/ProductList")
);
const LazyModelProduct = lazy(() =>
  import("./pages/products/ModelProducts/ModelProduct")
);
const LazyFloatingMailIcon = lazy(() =>
  import("./components/email floating icon/Floating")
);
const LazyProductDetail = lazy(() =>
  import("./components/product/Productpage")
);
const LazyOrderSuccess = lazy(() =>
  import("./pages/OrderSuccess/OrderSuccess.jsx")
);
// const LazyLoader = lazy(() => import("./Loader"));

// const LazyForgot =lazy(()=>import(""))
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isopenNavigation, setIsopenNavigation] = useState(false);
  const [isLogin, setIsLogin] = useState();

  const [cartTotalAmount, setCartTotalAmount] = useState();

  const location = useLocation();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const is_Login = localStorage.getItem("isLogin");
    setIsLogin(is_Login);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const signIn = () => {
    const is_Login = localStorage.getItem("isLogin");
    setIsLogin(is_Login);
  };

  const signOut = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
  };

  const value = {
    cartItems,
    isLogin,
    windowWidth,

    signOut,
    signIn,

    isopenNavigation,
    setIsopenNavigation,
    setCartTotalAmount,
    cartTotalAmount,
    setCartItems,
  };

  const isDashboardRoute =
    location.pathname.startsWith("/dash") ||
    location.pathname.startsWith("/dash") ||
    location.pathname.startsWith("/userwishlists") ||
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/refunds") ||
    location.pathname.startsWith("/user-profile")||
    location.pathname.startsWith("/changepassword");

  return (
    <MyContext.Provider value={value}>
      {isLoading ? (
        <div className="">
          <ImageLoader src={LogoImage} alt="Placeholder" />
        </div>
      ) : (
        <>
          {!isDashboardRoute && <Header />}
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyHome />
                </Suspense>
              }
            />

            <Route
              exact
              path="/category/:id/:productName"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyCategoryPage />
                </Suspense>
              }
            />
            <Route exact path="/cart" element={<Cart />} />
            <Route
              path="/signIn"
              element={
                userId ? (
                  <Navigate to="/" replace={true} />
                ) : (
                  <Suspense
                    fallback={<ImageLoader src={LogoImage} alt="Loading" />}
                  >
                    <LazySignIn />
                  </Suspense>
                )
              }
            />
            <Route
              path="/signUp"
              element={
                userId ? (
                  <Navigate to="/" replace={true} />
                ) : (
                  <Suspense
                    fallback={<ImageLoader src={LogoImage} alt="Loading" />}
                  >
                    <LazySignUp />
                  </Suspense>
                )
              }
            />
            <Route
              exact
              path="/checkout"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyCheckout />
                </Suspense>
              }
            />
            <Route
              exact
              path="/about"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyAbout />
                </Suspense>
              }
            />
            <Route
              exact
              path="*"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyNotFound />
                </Suspense>
              }
            />
            <Route
              path="/password-reset/:userId/:token"
              element={<LazyForgot />}
            />
            <Route
              path="/contact"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyContact />
                </Suspense>
              }
            />
            <Route path="/offer" element={<OffersPage />} />
            <Route
              path="/category/:mainProduct"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyListing />
                </Suspense>
              }
            />
            <Route
              path="/wishlist"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyWishlist />
                </Suspense>
              }
            />
            <Route
              path="/success/:orderId"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyOrderSuccess />
                </Suspense>
              }
            />
            <Route
              path="/product"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyProduct />
                </Suspense>
              }
            />
            <Route
              path="/product/:productId/models/:modelId/subproducts/:subProductId"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazySubProductDetails />
                </Suspense>
              }
            />
            <Route
              path="/products/:productId/models/:modelId"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyModelProduct />
                </Suspense>
              }
            />

            <Route
              path="/product/:productId/:modelId/:subProductId"
              element={
                <Suspense
                  fallback={<ImageLoader src={LogoImage} open={true} />}
                >
                  <LazyProductDetail />
                </Suspense>
              }
            />
            <Route exact path="/dash" element={<Dashboard />} />
            <Route path="/changepassword" element={<PasswordUpdateForm />} />
            <Route path="/userwishlists" element={<Wishlistforuser />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/refunds" element={<Refundforuser />} />
            <Route path="/user-profile" element={<Profileforuser />} />
            <Route path="/privacy" element={<FooterPrivacy />} />
            <Route path="/terms" element={<Footerterms />} />
          </Routes>
          {!isDashboardRoute && <Footer />}
          <WhatsApp
            phoneNumber="+919600811325"
            message="Hello! I'm interested in your services."
          />
          <FloatingMailIcon emailAddress="kumarsandcompanies@gmail.com" />
        </>
      )}
    </MyContext.Provider>
  );
}

export default App;

export { MyContext };
