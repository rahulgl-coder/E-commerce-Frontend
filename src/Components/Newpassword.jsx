




import { useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../Components/Usercontext';
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';

export default function Resetpassword() {
    const {id}=useParams()
    const {setUser,setToken}=useUser()
    const [formData,setFormData]=useState({})
    const [error,setError]=useState({})
    const [loading,setLoading]=useState(false)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const navigate=useNavigate()

    const validate = () => {
        const newErrors = {};
        if (!formData.password) newErrors.password = "Required";
        else if (!passwordRegex.test(formData.password)) newErrors.password = "Password must be at least 6 characters, including one number";
    
        if (!formData.confirmPassword) newErrors.confirmPassword = "Required";
        else if (formData.password!=formData.confirmPassword)
          newErrors.confirmPassword = "password dnt match";
    
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
          e.preventDefault();
          if (!validate()) return;
          setLoading(true);
      
          try {
            const res = await axios.put(`http://localhost:5000/api/auth/reset-password/${id}`, {password:formData.password});
            
            toast.success("Password Changed")
            navigate("/login")
          } catch (err) {
            // toast.error(err.response?.data?.message || 'Password change failed');
          } finally {
            setLoading(false);
          }
        };

    const handleChange=async(e)=>{
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error[name]) setError(prev => ({ ...prev, [name]: undefined }));

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
        <h2 className="text-4xl font-bold mb-2 text-gray-800">Reset your password</h2>
        <p className="text-gray-500 mb-6">Explore the cap world</p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
            {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
           
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition relative"
          >
            {loading ? <ClipLoader size={24} color="white" loading={loading} /> : "Submit"}
          </button>

        
        </form>

       
      </div>

    


    </div>
  );
}