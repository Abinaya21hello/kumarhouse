// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { CircularProgress, Container, Grid, Typography, Card, CardContent, CardHeader } from '@material-ui/core';
// import { Pagination } from '@material-ui/lab';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// function SeeAllOrders() {
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const ordersPerPage = 10;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/get-all-orders', {
//           withCredentials: true // Include credentials if needed
//         });
//         setOrders(response.data);
//         setFilteredOrders(response.data);
//         setIsLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setIsLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     if (date) {
//       const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
//       const filtered = orders.filter(order => {
//         const orderDate = new Date(order.createdAt.$date);
//         return (
//           orderDate.getFullYear() === date.getFullYear() &&
//           orderDate.getMonth() === date.getMonth() &&
//           orderDate.getDate() === date.getDate()
//         );
//       });
//       setFilteredOrders(filtered);
//     } else {
//       setFilteredOrders(orders); // Reset to all orders when date is cleared
//     }
//     setCurrentPage(1);
//   };
  

//   if (isLoading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

//   return (
//     <Container>
//       <Grid container spacing={2} justifyContent="center" alignItems="center">
//         <Grid item>
//           <DatePicker
//             selected={selectedDate}
//             onChange={handleDateChange}
//             dateFormat="yyyy-MM-dd"
//             isClearable
//             placeholderText="Filter by Date"
//             className="form-control"
//           />
//         </Grid>
//       </Grid>
//       <Grid container spacing={2} justifyContent="center" alignItems="center">
//         {currentOrders.map(order => (
//           <Grid item key={order._id} xs={12} sm={6} md={4}>
//             <Card>
//               <CardHeader
//                 title={`Order ID: ${order._id}`}
//                 subheader={`Status: ${order.status}`}
//               />
//               <CardContent>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   <strong>Total amount:</strong> {order.totalAmount} {order.currency}
//                 </Typography>
//                 {order.users.map(user => (
//                   <Typography key={user.userId.$oid} variant="body2" color="textSecondary" component="p">
//                     <strong>User:</strong> {user.userName}
//                   </Typography>
//                 ))}
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   <strong>Date of Order:</strong> {new Date(order.createdAt.$date).toLocaleDateString()}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   <strong>Products:</strong>
//                   <ul>
//                     {order.products.map(product => (
//                       <li key={product.productId.$oid}>
//                         {product.ProductName} - {product.quantity} pcs @ {product.currentPrice} {order.currency}
//                       </li>
//                     ))}
//                   </ul>
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   <strong>Delivery Address:</strong> {`${order.deliveryAddress.street}, ${order.deliveryAddress.district}, ${order.deliveryAddress.state}, ${order.deliveryAddress.country} - ${order.deliveryAddress.pincode}`}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   <strong>Delivery Date:</strong> {new Date(order.deliveryDate.$date).toLocaleDateString()}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
//         <Pagination
//           count={Math.ceil(filteredOrders.length / ordersPerPage)}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//         />
//       </Grid>
//     </Container>
//   );
// }

// export default SeeAllOrders;

import React from 'react'

function Seeallorders() {
  return (
    <div>Seeallorders</div>
  )
}

export default Seeallorders
