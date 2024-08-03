import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";
import "./OrderProfile.css";

const useStyles = (theme) => ({
  root: {
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    minHeight: "100vh",
    padding: "2rem",
    color: "#fff",
  },
  paper: {
    padding: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  tableHeader: {
    backgroundColor: "#6a11cb",
    color: "#fff",
  },
  tableCell: {
    color: "#333",
  },
  editButton: {
    color: "#6a11cb",
  },
  updateButton: {
    backgroundColor: "#6a11cb",
    color: "#fff",
  },
});

function UserProfile() {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState("");
  const [updatedDeliveryStatus, setUpdatedDeliveryStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [clickedButtons, setClickedButtons] = useState(
    JSON.parse(localStorage.getItem("clickedButtons")) || {}
  );

  const [filterOrderId, setFilterOrderId] = useState("");
  const [filterOrderDate, setFilterOrderDate] = useState("");
  const [filterDeliveryDate, setFilterDeliveryDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    localStorage.setItem("clickedButtons", JSON.stringify(clickedButtons));
  }, [clickedButtons]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("api/get-all-orders", {
        withCredentials: true,
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const payload = {};
      if (updatedPaymentStatus) {
        payload.status = updatedPaymentStatus;
      }
      if (updatedDeliveryStatus) {
        payload.deliveryStatus = updatedDeliveryStatus;
      }

      await axiosInstance.put(`api/update-order/${orderId}`, payload, {
        withCredentials: true,
      });

      await fetchOrders();
      setEditMode(false);
      setEditOrderId(null);
      setAlertMessage("");
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    try {
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const formattedDate = new Date(dateString).toLocaleDateString(
        "en-IN",
        options
      );
      return formattedDate;
    } catch (error) {
      console.error("Error parsing date:", error.message);
      return "Invalid Date";
    }
  };

  const updateStock = async (
    productId,
    modelId,
    subProductId,
    quantity,
    orderId,
    productIndex
  ) => {
    try {
      const response = await axiosInstance.put(
        `api/sub-product-stock-update/${productId}/models/${modelId}/sub-stock/${subProductId}`,
        { quantity },
        { withCredentials: true }
      );
      alert(response.data.message);

      setClickedButtons((prev) => ({
        ...prev,
        [`${orderId}-${productIndex}`]: true,
      }));
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesOrderId = order.order_id
      .toLowerCase()
      .includes(filterOrderId.toLowerCase());
    const matchesOrderDate = filterOrderDate
      ? formatDate(order.createdAt).includes(filterOrderDate)
      : true;
    const matchesDeliveryDate = filterDeliveryDate
      ? order.deliveryDate &&
        formatDate(order.deliveryDate).includes(filterDeliveryDate)
      : true;
    return (
      matchesOrderId &&
      matchesOrderDate &&
      matchesDeliveryDate &&
      (order.order_id.toLowerCase().includes(filterText.toLowerCase()) ||
        order.users[0].userName
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        order.users[0].email.toLowerCase().includes(filterText.toLowerCase()))
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status status-paid";
      case "pending":
        return "status status-pending";
      case "cancelled":
        return "status status-cancelled";
      default:
        return "";
    }
  };

  const getDeliveryStatus = (deliveryStatus) => {
    switch (deliveryStatus) {
      case "received":
        return "status status-received";
      case "not received":
        return "status status-not-received";
      default:
        return "";
    }
  };

  return (
    <div className={classes.root}>
      <h3 style={{ textAlign: "center" }}>ORDERS DETAILS</h3>
      {/* order filter container  */}
      <div className="OrderFilterContainer ">
        <div className="row">
          <div className="col-6">
            <TextField
              label="Filter by User Email"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={classes.filter}
            />
          </div>
          <div className="col-6">
            <TextField
              label="Filter by Order ID"
              value={filterOrderId}
              onChange={(e) => setFilterOrderId(e.target.value)}
              className={classes.filter}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <TextField
              label="Filter by Order Date (DD/MM/YYYY)"
              value={filterOrderDate}
              onChange={(e) => setFilterOrderDate(e.target.value)}
              className={classes.filter}
            />
          </div>
          <div className="col-6">
            <TextField
              label="Filter by Delivery Date (DD/MM/YYYY)"
              value={filterDeliveryDate}
              onChange={(e) => setFilterDeliveryDate(e.target.value)}
              className={classes.filter}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {alertMessage && (
              <Alert severity="warning" onClose={() => setAlertMessage("")}>
                {alertMessage}
              </Alert>
            )}
            <TableContainer component={Paper} className={classes.paper}>
              <Table aria-label="Orders table">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell align="center">S.No</TableCell>
                    <TableCell align="center">Order ID</TableCell>
                    <TableCell align="center">Payment Method</TableCell>
                    <TableCell align="center">Payment Status</TableCell>
                    <TableCell align="center">Total Amount</TableCell>
                    <TableCell align="center">User Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Phone</TableCell>
                    <TableCell align="center" style={{ minWidth: "200px" }}>
                      Products Ordered
                    </TableCell>
                    <TableCell align="center">Delivery Address</TableCell>
                    <TableCell align="center">Ordered Date (IST)</TableCell>
                    <TableCell align="center">Delivery Date (IST)</TableCell>
                    <TableCell align="center">Delivery Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? filteredOrders.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : filteredOrders
                  ).map((order, index) => (
                    <TableRow key={order._id}>
                      <TableCell align="center" className={classes.tableCell}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.order_id}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.method}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {editOrderId === order._id ? (
                          <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="payment-status">
                              Payment Status
                            </InputLabel>
                            <Select
                              value={updatedPaymentStatus}
                              onChange={(e) =>
                                setUpdatedPaymentStatus(e.target.value)
                              }
                              label="Payment Status"
                              inputProps={{
                                name: "payment-status",
                                id: "payment-status",
                              }}
                            >
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography className={getStatusClass(order.status)}>
                            {order.status}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.totalAmount} {order.currency}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.users[0].userName}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.users[0].email}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.users[0].phone}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        <ul>
                          {order.products.map((product, productIndex) => (
                            <li key={product._id}>
                              {product.ProductName} - {product.quantity}{" "}
                              {product.currentPrice} {order.currency}
                              {order.deliveryStatus === "received" && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className={classes.updateButton}
                                  onClick={() => {
                                    updateStock(
                                      product.productId,
                                      product.modelId,
                                      product.subProductId,
                                      product.quantity,
                                      order._id,
                                      productIndex
                                    );
                                  }}
                                  disabled={
                                    clickedButtons[
                                      `${order._id}-${productIndex}`
                                    ]
                                  }
                                >
                                  {clickedButtons[
                                    `${order._id}-${productIndex}`
                                  ]
                                    ? "Updated"
                                    : "Update Stock"}
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {`${order.deliveryAddress.street}, ${order.deliveryAddress.district}, ${order.deliveryAddress.state} ${order.deliveryAddress.pincode}, ${order.deliveryAddress.country}`}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {order.deliveryDate
                          ? formatDate(order.deliveryDate)
                          : "Not available"}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {editOrderId === order._id ? (
                          <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="delivery-status">
                              Delivery Status
                            </InputLabel>
                            <Select
                              value={updatedDeliveryStatus}
                              onChange={(e) =>
                                setUpdatedDeliveryStatus(e.target.value)
                              }
                              label="Delivery Status"
                              inputProps={{
                                name: "delivery-status",
                                id: "delivery-status",
                              }}
                            >
                              <MenuItem value="received">Received</MenuItem>
                              <MenuItem value="not received">
                                Not Received
                              </MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography
                            className={getDeliveryStatus(
                              order.deliveryStatus
                            )}
                          >
                            {order.deliveryStatus}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" className={classes.tableCell}>
                        {(order.status === "pending" &&
                          order.deliveryStatus === "not received") ||
                        (order.status === "paid" &&
                          order.deliveryStatus === "not received") ||
                        (order.status === "pending" &&
                          order.deliveryStatus === "received") ? (
                          <>
                            {order.status === "pending" &&
                              order.deliveryStatus === "received" && (
                                <Alert
                                  severity="warning"
                                  onClose={() => setAlertMessage("")}
                                >
                                  Alert: Money is still not paid!
                                </Alert>
                              )}
                            <IconButton
                              className={classes.editButton}
                              onClick={() => {
                                setEditMode(true);
                                setEditOrderId(order._id);
                                setUpdatedPaymentStatus(order.status);
                                setUpdatedDeliveryStatus(
                                  order.deliveryStatus
                                );
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            {editOrderId === order._id && (
                              <Button
                                variant="contained"
                                className={classes.updateButton}
                                onClick={() => handleUpdateOrder(order._id)}
                                style={{ marginLeft: "1rem" }}
                                disabled={
                                  updatedPaymentStatus === "" ||
                                  updatedDeliveryStatus === ""
                                }
                              >
                                Update
                              </Button>
                            )}
                          </>
                        ) : (
                          "Order placed"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserProfile;
