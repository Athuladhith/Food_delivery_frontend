import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {getAuthConfig} from '../../Apiconfig'
import api from '../../Api'

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  image: string; // Assuming this field contains the image URL or path
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderDetails {
  foodItems: {
    foodItem: string; // ID of the food item
    quantity: number;
  }[];
  address: Address;
  totalAmount: number;
  orderStatus: string;
}

interface DetailedFoodItem {
  id: string;
  name: string;
  image: string;
}

const OrderDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { paymentId, paymentMethod } = location.state || {};
  const [orderStatus, setOrderStatus] = useState<string>('Preparing');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [detailedFoodItems, setDetailedFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (!paymentId) {
      navigate('/checkout');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        
        // Fetch order details
        const response = await api.get(`http://localhost:5000/api/users/orders/${paymentId}`);
        const orderData = response.data;
        setOrderDetails(orderData);
        setOrderStatus(orderData.orderStatus);

        // Fetch details for each food item
        const foodItemPromises = orderData.foodItems.map(async (item: { foodItem: string; quantity: number }) => {
          
          const foodResponse = await api.get(`http://localhost:5000/api/users/${item.foodItem}`);
          return {
            id: foodResponse.data._id,
            name: foodResponse.data.name,
            image: foodResponse.data.image,
            quantity: item.quantity
          };
        });

        const foodItemsDetails = await Promise.all(foodItemPromises);
        setDetailedFoodItems(foodItemsDetails);

      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [paymentId, navigate]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  const { address, totalAmount, orderStatus: status } = orderDetails;
  console.log(orderDetails, 'order detail in the orderdetails page');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Order Details</h1>

      <div className="border p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
        <div className="mb-4">
          <p className="text-lg">
            <span className="font-bold">Payment Method:</span> {paymentMethod}
          </p>
          <p className="text-lg">
            <span className="font-bold">Payment ID:</span> {paymentId}
          </p>
          <p className="text-lg">
            <span className="font-bold">Total Amount:</span> ₹{totalAmount}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Order Status</h2>
        <p className="text-lg">
          <span className="font-bold">Current Status:</span> {status}
        </p>

        {/* Status Display */}
        {orderStatus === 'Preparing' && (
          <p className="text-yellow-600">Your order is being prepared. Estimated time: 30 minutes.</p>
        )}
        {orderStatus === 'Out for Delivery' && (
          <p className="text-green-600">Your order is out for delivery. Please be ready to receive it.</p>
        )}
        {orderStatus === 'Delivered' && (
          <p className="text-blue-600">Your order has been delivered. Enjoy your meal!</p>
        )}

        <h2 className="text-2xl font-semibold mt-6 mb-4">Delivery Address</h2>
        <p className="text-lg">
          {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Ordered Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {detailedFoodItems.map((item: FoodItem) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-lg">
              <img
                src={`data:image/jpeg;base64,${item.image}`} // Assuming the image field contains the filename or URL
                alt={item.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-2">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-md">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/home')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
