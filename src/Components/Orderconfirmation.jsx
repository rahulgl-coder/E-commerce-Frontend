
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Components/Usercontext';
import Header from './navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from './Loading';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function OrderConfirmationPage() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    name: '',
    house: '',
    street: '',
    location: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await axios.get(`http://localhost:5000/api/auth/cart/${user._id}`);
        const addressRes = await axios.get(`http://localhost:5000/api/auth/address/${user._id}`);
        setCartItems(cartRes.data.cartItems);
        setAddresses(addressRes.data.addresses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const validateAddress = () => {
    const tempErrors = {};
    if (!newAddress.name.trim()) tempErrors.name = 'Name is required';
    if (!newAddress.house.trim()) tempErrors.house = 'House/Flat is required';
    if (!newAddress.street.trim()) tempErrors.street = 'Street is required';
    if (!newAddress.location.trim()) tempErrors.location = 'Location is required';
    if (!newAddress.city.trim()) tempErrors.city = 'City is required';
    if (!newAddress.state.trim()) tempErrors.state = 'State is required';
    if (!newAddress.pincode.trim()) {
      tempErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(newAddress.pincode)) {
      tempErrors.pincode = 'Pincode must be 6 digits';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); 
  };

  const handleAddressSubmit = async () => {
    if (!validateAddress()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/address`, {
        ...newAddress,
        userId: user._id
      });
      setAddresses([...addresses, res.data]);
      setSelectedAddressId(res.data._id);
      setNewAddress({
        name: '',
        house: '',
        street: '',
        location: '',
        city: '',
        state: '',
        pincode: ''
      });
      setShowNewAddressForm(false);
      setErrors({});
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  // const handlePlaceOrder = async () => {
  //   if (!selectedAddressId) {
  //     setErrors({ general: "Please select or add an address." });
  //     return;
  //   }
  
  //   try {
  //     const addressToUse = addresses.find(a => a._id === selectedAddressId);
  
  //     const response = await axios.post('http://localhost:5000/api/order/addorder', {
  //       userId: user._id,
  //       cartItems,
  //       address: addressToUse,
  //       totalAmount: total,
  //       paymentId: "TXN-" + Date.now()
  //     });
  //     await axios.delete(`http://localhost:5000/api/order/deletecart/${user._id}`);
  //     toast.success("Order placed successfully!");
  //     navigate('/profile');
  //   } catch (error) {
  //     console.error("Failed to place order:", error);
  //     toast.error("Order failed!");
  //   }
  // };

  const total = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setErrors({ general: "Please select or add an address." });
      return;
    }
  
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }
  
    const addressToUse = addresses.find((a) => a._id === selectedAddressId);
    const totalAmount = total;
  

    const orderResult = await axios.post("http://localhost:5000/api/payment/create-order", {
      amount: totalAmount,
    });
  
    const options = {
      key: import.meta.env.VITE_RAZOR_KEY,
      amount: orderResult.data.amount,
      currency: orderResult.data.currency,
      name: "My eCommerce Site",
      description: "Order Payment",
      order_id: orderResult.data.id,
      handler: async function (response) {
        // Payment success, place order
        try {
          await axios.post("http://localhost:5000/api/order/addorder", {
            userId: user._id,
            cartItems,
            address: addressToUse,
            totalAmount,
            paymentId: response.razorpay_payment_id,
          });
          await axios.delete(`http://localhost:5000/api/order/deletecart/${user._id}`);
          toast.success("Payment successful & order placed!");
          navigate("/profile");
        } catch (err) {
          console.error(err);
          toast.error("Order failed after payment");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  
  

  

  if (loading) return (<Loading/>)
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
        
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Cart</h2>
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-4 items-center border-b py-3">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-16 h-16 rounded-md object-cover border"
                    onError={(e) => { e.target.src = '/default-image.png'; }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productId.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-gray-800">₹{item.productId.price * item.quantity}</div>
                </div>
              ))}
            </div>

 
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Select Delivery Address</h2>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-indigo-600 hover:underline text-sm font-medium"
                  >
                    {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                  </button>
                )}
              </div>

              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <label
                      key={addr._id}
                      className={`block p-4 border rounded-xl cursor-pointer ${
                        selectedAddressId === addr._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mr-3"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => {
                          setSelectedAddressId(addr._id);
                          setErrors(prev => ({ ...prev, general: '' }));
                        }}
                      />
                      <span className="font-semibold">{addr.name}</span>
                      <p className="text-sm text-gray-600">
                        {addr.house}, {addr.street}, {addr.location}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No saved address found. Please add one below.</p>
              )}

              {errors.general && (
                <p className="text-red-500 text-sm mt-2">{errors.general}</p>
              )}

   
              <AnimatePresence>
                {(showNewAddressForm || addresses.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2"
                  >
                    {[
                      { name: "name", placeholder: "Name" },
                      { name: "house", placeholder: "House/Flat No." },
                      { name: "street", placeholder: "Street" },
                      { name: "location", placeholder: "Location" },
                      { name: "city", placeholder: "City" },
                      { name: "state", placeholder: "State" },
                      { name: "pincode", placeholder: "Pincode" },
                    ].map(({ name, placeholder }) => (
                      <div key={name} className="col-span-1">
                        <input
                          name={name}
                          value={newAddress[name]}
                          onChange={handleAddressChange}
                          placeholder={placeholder}
                          className={`border rounded-lg px-4 py-2 w-full ${
                            errors[name] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[name] && (
                          <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
                        )}
                      </div>
                    ))}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddressSubmit}
                      className="col-span-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg mt-2 shadow-sm"
                    >
                      Save Address
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            <div className="text-lg font-medium text-gray-700 flex justify-between">
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="text-xl font-bold text-gray-900 flex justify-between border-t pt-4">
              <span>Total Amount:</span>
              <span>₹{total}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold shadow-md"
            >
              Place Order
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
