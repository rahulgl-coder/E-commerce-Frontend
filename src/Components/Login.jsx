


import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../Components/Usercontext';
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';

export default function Login() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modal,setModal]=useState(false)
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [otp,setOtp]=useState("")
  const [approved,setApproved]=useState({})

  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Required";
    else if (!passwordRegex.test(formData.password))
      newErrors.password = "Password must be at least 6 characters, including one number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const user = res.data.user;
      setSuccess(true);

      if (res.status === 200) {
        setUser(user);
        setToken(res.data.token);
      }

      setTimeout(() => {
        navigate(user.role === "admin" ? '/dashboard' : '/');
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail || !emailRegex.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }


    setResetLoading(true);
    try {

     
      
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: resetEmail });
     toast.success(res.data.message || "Reset otp has send to your mail!");
      
      setShowModal(false);

      setResetEmail('');
      setModal(true)
      setApproved(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setResetLoading(false);
    }
  };

  
  

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email: approved.email,purpose:"forgot_password" });
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP'); 
    }
  };

  const handleOtp=async ()=>{
    try {
      await axios.post('http://localhost:5000/api/auth/otp-verification', { user: approved,otp:otp });
      toast.success('OTP verification succesfull');
      navigate(`/reset_password/${approved._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }
  


  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-8">
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
          alt="signup visual"
          className="rounded-xl shadow-xl w-full max-w-md"
        />
      </div>

      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-2 text-gray-800">Account Details</h2>
        <p className="text-gray-500 mb-6">Explore the cap world</p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <div className="text-right mt-1">
              <button type="button" onClick={() => setShowModal(true)} className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition relative"
          >
            {loading ? <ClipLoader size={24} color="white" loading={loading} /> : "Log In"}
          </button>

          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-green-600 font-bold text-center flex items-center justify-center gap-2 mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Login successful
            </motion.p>
          )}
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-black font-semibold">Sign up</a>
        </p>
      </div>

    
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl">
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              {resetLoading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
          </div>
        </div>
      )}

{modal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
    <button 
  onClick={() => {
    setModal(false);
    setOtp("");
  }} 
  className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
>
  &times;
</button>

      <h3 className="text-xl font-semibold mb-4">Enter Otp</h3>
      <input
        type="text"
        placeholder="Enter 6 digit otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-black"
      />
      <button
        onClick={handleOtp}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
      >
        {loading ? <ClipLoader size={20} color="white" /> : "Submit"}
      </button>
      <button onClick={handleResendOtp} className="text-blue-500 hover:underline mt-2">
  Resend OTP
</button>

    </div>
  </div>
)}
    </div>
  );
}
