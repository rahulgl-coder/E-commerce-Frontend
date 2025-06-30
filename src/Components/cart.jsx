



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Components/Usercontext';
import Header from './navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from './Loading';

export default function CartPage() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/cart/${user._id}`);
        setCartItems(res.data.cartItems);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setLoading(false);
      }
    };

    if (user) fetchCart();
  }, [user]);

  const handleRemove = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/cart/${cartItemId}`);
      toast.success("Product removed successfully")
      setCartItems(prev => prev.filter(item => item._id !== cartItemId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleCheckout = () => {

    if (cartItems.length > 0) {
      navigate(`/orderconfirmation/${cartItems[0].productId._id}`);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  if (loading) {
    return (
      <Loading/>
    )
        
  }
  
  

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 flex items-center justify-center gap-3">
              <ShoppingCart className="w-8 h-8 text-indigo-600" />
              Your Cart
            </h2>
            <p className="text-center text-gray-500 mt-2">
              {cartItems.length} items in your cart
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate('/all-products')}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
          
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.productId.name}
                          </h3>
                          <p className="text-indigo-600 font-medium text-lg">
                            ₹{item.productId.price}
                          </p>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                             
                              </button>
                              <span className="px-4 py-2 border-x border-gray-200 font-medium">
                               Quantity:  {item.quantity}
                              </span>
                              <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                              
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{item.productId.price * item.quantity}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemove(item._id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Remove</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

          
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxes</span>
                      <span>₹0</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-medium transition-colors mt-6 flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    
                    <div className="text-center mt-4">
                      <button
                        onClick={() => navigate('/all-products')}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}