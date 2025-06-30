


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../Components/Usercontext';
import toast from 'react-hot-toast';

export default function AllProductsPage() {
  const [product, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
 const{user,token} =useUser()




  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data.product);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [user]);

  const totalPages = Math.ceil(product.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const visibleProducts = product.slice(start, start + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addCart= async(product)=>{
    if (!user) {
      toast('Please login to add to cart!');
      return;
    }

    try {

      await axios.post('http://localhost:5000/api/auth/cart', {
        userId: user._id,
        productId: product._id,
        quantity: 1,
      });
     
  

      toast.success('Product added to cart! ');
   
    } catch (error) {
      console.error('Error adding to cart:', error);
   
    }
 }

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-black"

            >
              Explore Our Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-xl max-w-2xl mx-auto"
            >
              Discover the perfect cap to complete your style
            </motion.p>
          </div>

        
          <div className="text-gray-600">
              Showing {start + 1}-{Math.min(start + itemsPerPage, product.length)} of {product.length} products
            </div>
     
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div 
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="relative aspect-square overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
            
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20 flex items-center gap-2 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        addCart(product);
                      }}>
                      <ShoppingCart className="w-4 h-4" />
                      Quick Add
                    </motion.button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{product.color}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full hover:bg-red-50 transition group"
                      >
                        <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition" />
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-indigo-600">₹{product.price}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/product/${product._id}`)}
                        className=" mt-3 px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>

          
           
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

       
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center">
              <nav className="inline-flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => {
                    if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 2)) {
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition
                            ${currentPage === i + 1
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (i === currentPage - 3 || i === currentPage + 3) {
                      return <span key={i} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}