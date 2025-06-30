



import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useUser } from '../Components/Usercontext'
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';



export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser,setToken } = useUser();
  const [modal,showModal]=useState(false)
  const [otp,setOtp]=useState("")
  const [approved,setapproved]=useState({})

  const nameRegex = /^[A-Za-z\s]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;



  const validate = () => {
    const newErrors = {};
  
    if (!formData.name) {
      newErrors.name = "Required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must contain only letters and spaces (min 2 characters)";
    }
  
    if (!formData.email) {
      newErrors.email = "Required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
  
    if (!formData.password) {
      newErrors.password = "Required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters, including one number";
    }
  
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const newErrors = { ...errors };
  
    if (name === "name") {
      if (!value) {
        newErrors.name = "Required";
      } else if (!nameRegex.test(value)) {
        newErrors.name = "Name must contain only letters and spaces (min 2 characters)";
      } else {
        delete newErrors.name;
      }
    }
  
    if (name === "email") {
      if (!value) {
        newErrors.email = "Required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }
  
    if (name === "password") {
      if (!value) {
        newErrors.password = "Required";
      } else if (!passwordRegex.test(value)) {
        newErrors.password = "Password must be at least 6 characters, including one number";
      } else {
        delete newErrors.password;
      }
  
      if (updatedFormData.confirmPassword && updatedFormData.confirmPassword !== value) {
        newErrors.confirmPassword = "Passwords don't match";
      } else {
        delete newErrors.confirmPassword;
      }
    }
  
    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Required";
      } else if (value !== updatedFormData.password) {
        newErrors.confirmPassword = "Passwords don't match";
      } else {
        delete newErrors.confirmPassword;
      }
    }
  
    setErrors(newErrors);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setapproved(res.data.user)
      console.log(approved);
      
       showModal(true)
   
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
    finally {
      setLoading(false);
    }
  };
   
  const handleOtp=async(e)=>{
    e.preventDefault()
    setLoading(true)
       try {
         
        await axios.post("http://localhost:5000/api/auth/otp-verification",{otp,user:approved})
        showModal(false)
        toast.success("Otp Verified")
        setOtp("")
        navigate("/login")
        
       } catch (error) {
        toast.error(error.response?.data?.message || 'Otp failed');
        setOtp("")
       }finally{
        setLoading(false)
       }


  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
    
      

      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        token: credentialResponse.credential,
      });

  
      if (res.status === 200) {
        setUser(res.data.user)
        setToken(res.data.token);
      }
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      alert("Google login failed");
    }
  };
  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email: approved.email,purpose:"signup" });
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP'); 
    }
  };
  

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
        <h2 className="text-4xl font-bold mb-2 text-gray-800">Create an Account</h2>
        <p className="text-gray-500 mb-6">Join us and explore the cap world</p>

        <form className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
             {loading ? (
            <ClipLoader size={24} color="white" loading={loading} />
          ) : (
            "Sign Up"
          )}
      
          <span
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          >
            Sign Up
          </span>
         
          </button>

          <div className="text-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google Login Failed")}
               useOneTap
             scope="openid email profile"
            />
          </div>
{/* 
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
            Otp send to given email
            </motion.p>
          )} */}
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account? <a href="/login" className="text-black font-semibold">Log in</a>
        </p>
      </div>



{modal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
    <button 
  onClick={() => {
    showModal(false);
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
