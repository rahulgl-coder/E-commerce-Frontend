

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import Header from './navbar';
import { useProducts } from './Productcontext';
import Footer from './Footer';
import { useUser } from '../Components/Usercontext'; 
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const { user } = useUser(); 
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    const existingProduct = products.find(p => p._id === id);
    if (existingProduct) {
      setProduct(existingProduct);
    } else {
      const fetchSingleProduct = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/auth/product/${id}`);
          setProduct(res.data.product);
        } catch (err) {
          console.error('Error fetching product:', err);
        }
      };
      fetchSingleProduct();
    }
  }, [id, products]);

  if (!product) return <p className="p-10 text-gray-600">Loading...</p>;

  const addCart = async () => {
    if (!user) {
      toast('please login for ADD TO CART');
      navigate("/signup")
      return;
    }

    try {
    await axios.post('http://localhost:5000/api/auth/cart', {
        userId: user._id,
        productId: product._id,
        quantity: 1,
      });

   
      toast.success('Product added to cart!');
      
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Adding to cart failed');
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image Section */}
            <div className="w-full h-full flex justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105"
              />
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-xl text-blue-600 font-medium mb-4">₹{product.price}</p>
                <p className="text-md text-gray-600 mb-6">
                  {product.Quantity > 0 ? (
                    <span className="text-green-600 font-semibold">In Stock</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Out of Stock</span>
                  )}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {product.description || 'This product is crafted for ultimate performance and comfort. Explore its features and experience the quality first-hand.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={addCart}
                  className="flex items-center gap-3 bg-orange-500 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:bg-orange-600 transition duration-300 ease-in-out"
                >
                  <FaShoppingCart className="text-lg" /> Add to Cart
                </button>
                <button
                  onClick={() => alert('Added to wishlist!')}
                  className="flex items-center gap-3 border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-lg font-medium hover:bg-pink-50 transition duration-300 ease-in-out"
                >
                  <FaHeart className="text-lg" /> Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
