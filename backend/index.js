const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRouter = require("./Router/userRouter/userRoute");
const productsRouterpro = require("./Router/adminRouter/productsRouter");
const reviewsRouter = require("./Router/adminRouter/reviewsRouter");
const offerpageRouter = require("./Router/ProductRouter/productRouter");
const WishlistRouter = require("./Router/adminRouter/wishlistRouter");
const productRouter = require("./Router/ProductRouter/productRouter");
const topNavRouter = require("./Router/adminRouter/topNavRouter");
const cartItemsRouter = require("./Router/ProductRouter/cartitemRouter");
const OrderPayment = require("./Router/orderPaymentRouter/paymentrouter");
const userOrders = require("./Router/orderRouter/orderRouter");
const refundRouter = require("./Router/adminRouter/RefundRouter");
const registerAdmin = require("./Router/adminRouter/adminregisterRouter");

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://www.eherbals.in",

  "https://admin.eherbals.in",
  "https://kumar-herbal-back.vercel.app",
  
  "https://back.eherbals.in/", // Add your Vercel deployment URL here
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies)
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!"); // Example route
});

// Use routers
app.use("/api", userRouter);
app.use("/api", topNavRouter);
app.use("/api", cartItemsRouter);
app.use("/api", offerpageRouter);
app.use("/api", productsRouterpro);
app.use("/api", reviewsRouter);
app.use("/api", registerAdmin);
app.use("/api", WishlistRouter);
app.use("/api", productRouter);
app.use("/api", OrderPayment);
app.use("/api", userOrders);
app.use("/api", refundRouter);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://kumarsandcompanies:ogstvAjl01wHteyT@kumar.l4cmiht.mongodb.net/kumarherbals",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// Catch-all route for non-existent routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
