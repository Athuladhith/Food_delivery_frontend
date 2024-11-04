import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from './Mainlayout';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

interface Order {
  id: string;
  foodItems: { foodItemName: string; quantity: number }[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  orderStatus: 'pending' | 'accepted' | 'rejected';
}

const RestaurantHome: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);


  

  const restaurantId =localStorage.getItem('restaurantid') 
  console.log(restaurantId,'restaurantidddd'); // Use the actual restaurant ID

  useEffect(() => {
    // Fetch orders for the restaurant from the backend API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurant/orders/${restaurantId}`);
        console.log(response, 'response in restaurant');
        console.log(response.data.foodItems, 'response in restaurant in detail');

        const fetchedOrders = response.data.map((order: any) => ({
          id: order._id,
          foodItems: order.foodItems.map((item: any) => ({
            foodItemName: item.foodItem.name, // Assuming the backend sends `foodItem.name`
            quantity: item.quantity,
          })),
          totalAmount: order.totalAmount,
          deliveryAddress: order.address, // Assuming `address` is a string
          paymentMethod: order.paymentMethod,
          orderStatus: 'pending',
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, orderStatus: 'accepted' } : order
    ));
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, orderStatus: 'rejected' } : order
    ));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  return (
    <MainLayout>
      <div>
        <Typography variant="h4" align="center" gutterBottom>
          Restaurant Orders
        </Typography>
        <TableContainer component={Paper} sx={{ overflowX: 'auto', marginBottom: '20px' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Food Items</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                <TableCell align="right">Delivery Address</TableCell>
                <TableCell align="right">Payment Method</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {order.foodItems.map((item) => (
                      <div key={item.foodItemName}>
                        {item.foodItemName} (x{item.quantity})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">${order.totalAmount}</TableCell>
                  <TableCell align="right">{order.deliveryAddress}</TableCell>
                  <TableCell align="right">{order.paymentMethod}</TableCell>
                  <TableCell align="right">
                    <Typography color={order.orderStatus === 'pending' ? 'orange' : order.orderStatus === 'accepted' ? 'green' : 'red'}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" onClick={() => handleAcceptOrder(order.id)} disabled={order.orderStatus !== 'pending'}>
                      Accept
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleRejectOrder(order.id)} disabled={order.orderStatus !== 'pending'} sx={{ marginLeft: '10px' }}>
                      Reject
                    </Button>
                    <Button variant="outlined" onClick={() => handleViewDetails(order)} sx={{ marginLeft: '10px' }}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for viewing order details */}
        {selectedOrder && (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              <Typography variant="body1"><strong>Food Items:</strong></Typography>
              {selectedOrder.foodItems.map(item => (
                <Typography key={item.foodItemName} variant="body2">{item.foodItemName} (x{item.quantity})</Typography>
              ))}
              <Typography variant="body1"><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</Typography>
              <Typography variant="body1"><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</Typography>
              <Typography variant="body1"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedOrder.orderStatus}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default RestaurantHome;
