


import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useProducts } from './Productcontext';
import { useUser } from './Usercontext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Productlist() {
  const { setProducts } = useProducts();
  const { user } = useUser();
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 4;
  
  const trackRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/products`,{
  withCredentials: true
});
     console.log(res);
     
        setProduct(res.data.product);
        setProducts(res.data.product);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [user]);

  const totalPages = Math.ceil(product.length / itemsPerPage);
  const handleNext = () => {
    if (startIndex + itemsPerPage < product.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };


  const getTranslateX = () => {
    return `translateX(-${(startIndex / itemsPerPage) * 100}%)`;
  };

  return (
    <div className="bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h2>
          <button
            onClick={() => navigate('/all-products')}
            className=" mt-3 px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
          >
            See More
          </button>
        </div>


        {product.length > itemsPerPage && (
          <>
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= product.length}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </>
        )}

     
        <div className="overflow-hidden">
        <div
  ref={trackRef}
  className="flex transition-transform duration-500 ease-in-out"
  style={{
    transform: `translateX(-${(startIndex / product.length) * 100}%)`,
    width: `${(product.length) * 100 / itemsPerPage}%`,
  }}
>

            {product.map((prod) => (
              <div
                key={prod._id}
                onClick={() => navigate(`/product/${prod._id}`)}
                className="w-full sm:w-1/2 lg:w-1/4 p-2 cursor-pointer"
              >
                <div className="group relative">
                  <img
                    alt={prod.imageAlt}
                    src={prod.image}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">{prod.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{prod.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{prod.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {product.length > itemsPerPage && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${index === startIndex / itemsPerPage ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setStartIndex(index * itemsPerPage)}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
