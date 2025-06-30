
import React, { useState, useEffect } from 'react';
import { useUser } from './Usercontext';
import toast from 'react-hot-toast';
import Header from './navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, loading } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && user === null) {
   
      navigate("/signup");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?._id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/order/getorder/${user._id}`);
          setOrders(res.data);
        } catch (err) {
          console.error("Error fetching orders", err);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    toast("Logged out successfully!");
  };

  if (loading) {
    return (
    <Loading/>
    );
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">
            My Profile
          </h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all duration-150 ease-in-out transform hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>


        
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
  <div className="relative bg-gray-900 px-8 py-16 text-white">

    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    <div className="flex flex-col md:flex-row md:items-center gap-8">
  
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400 to-purple-500 blur-md opacity-75"></div>
        <div className="h-28 w-28 rounded-full bg-white border-4 border-white shadow-lg relative flex items-center justify-center text-gray-900 text-3xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
      
  
      <div className="md:pl-4 md:border-l md:border-white/20">
        <h2 className="text-4xl font-bold tracking-tight">{user.name}</h2>
        <div className="flex items-center mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <p className="text-gray-300 text-lg">{user.email}</p>
        </div>
      
      </div>
    </div>
  </div>
</div>





        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/all-product')}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 text-white">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <span className="text-gray-300 text-sm">Order ID:</span>
                      <span className="ml-2 font-mono font-medium">{order._id}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {order.cartItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-b border-gray-100">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={item.productId?.image || 'https://via.placeholder.com/80'}
                          alt={item.productId?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-xl text-gray-900">{item.productId?.name || 'Product'}</h3>
                        <div className="mt-2 flex items-center text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Qty: {item.quantity}
                          </span>
                          <span className="mx-2">•</span>
                          <span>₹{item.productId?.price || 0} per item</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center">
                  <div className="font-bold text-xl text-gray-900">
                    Total: <span className="text-green-600">₹{order.totalAmount}</span>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium
                      ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}