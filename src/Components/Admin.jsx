


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './Usercontext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout, loading ,token} = useUser();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', Quantity: '', image: '', category: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0, lowStock: 0 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [image,setImage] = useState("")
  const navigate=useNavigate()

  const [editingProduct, setEditingProduct] = useState(null);


  // if (!loading && user && user.role !== "admin") {
  //   navigate("/");
  // }



  useEffect(() => {
   

    if (!token) return;

  
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
  
        const res = await axios.get('http://localhost:5000/api/admin/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const products = res?.data?.product || [];
        setProducts(products);
  
        const active = products.filter(p => !p.blocked).length;
        const blocked = products.filter(p => p.blocked).length;
        const lowStock = products.filter(p => p.Quantity < 10).length;
  
        setStats({
          total: products.length,
          active,
          blocked,
          lowStock,
        });
  
      } catch (err) {
        console.error('Error fetching products:', err);
        showNotification('Failed to load products', 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, [token]);
  

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setForm({ 
  //     ...form, 
  //     [name]: type === 'checkbox' ? checked : value 
  //   });
  // };

  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;
  
    if (type === 'file') {
       setImage(files[0])
    } else {
      setForm({
        ...form,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };
  

  const resetForm = () => {
    setForm({ name: '', price: '', Quantity: '', image: '', category: '', description: '', blocked: false });
    setEditingProduct(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.Quantity || form.image){
      console.log(form.image);
      
      showNotification('Please fill all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      if (editingProduct) {
        response = await axios.put(`http://localhost:5000/api/admin/edit/${editingProduct._id}`,form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 
        setProducts(products.map(p => p._id === editingProduct._id ? response.data : p));
        showNotification('Product updated successfully', 'success');
      } else {
        const data = new FormData()
        data.append("price",form.price)
        data.append("Quantity",form.Quantity)
        data.append("name",form.name)
       
        data.append("image",image)

        console.log(data);
        
        response = await axios.post('http://localhost:5000/api/admin/add', data,{
          headers: {},
        }); 
        setProducts([...products, response.data]);
        showNotification('Product added successfully', 'success');
      }
      
      resetForm();
      setShowForm(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Error saving product:', err);
      showNotification('Failed to save product', 'error');
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      Quantity: product.Quantity,
      image: product.image,
      blocked: product.blocked
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleRemove = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 

      setProducts(products.filter((p) => p._id !== id));
      setConfirmDelete(null);
      showNotification('Product deleted successfully', 'success');
      setIsLoading(false);
    } catch (err) {
      console.error('Error removing product:', err);
      showNotification('Failed to delete product', 'error');
      setIsLoading(false);
    }
  };

  const handleBlock = async (id, currentStatus) => {
    setIsLoading(true);
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/block/${id}`,
        { blocked: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      const updatedProducts = products.map((p) =>
        p._id === id ? { ...p, blocked: !p.blocked } : p
      );
      
      setProducts(updatedProducts);
      

      const active = updatedProducts.filter(p => !p.blocked).length;
      const blocked = updatedProducts.filter(p => p.blocked).length;
      
      setStats({
        ...stats,
        active,
        blocked
      });
      
      showNotification(`Product ${!currentStatus ? 'blocked' : 'unblocked'} successfully`, 'success');
      setIsLoading(false);
    } catch (err) {
      console.error('Error blocking/unblocking product:', err);
      showNotification('Action failed', 'error');
      setIsLoading(false);
    }
  };

   const handleLogout = () => {
      logout();
      navigate("/")
     
    };
  
 

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };


  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (activeFilter === 'all') return matchesSearch;
      if (activeFilter === 'active') return matchesSearch && !product.blocked;
      if (activeFilter === 'blocked') return matchesSearch && product.blocked;
      if (activeFilter === 'lowStock') return matchesSearch && product.Quantity < 10;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'priceAsc') return a.price - b.price;
      if (sortOption === 'priceDesc') return b.price - a.price;
      if (sortOption === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortOption === 'nameAsc') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen">

      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold flex items-center"
          >
            <span className="text-4xl mr-2">🛍️</span> Admin Dashboard
          </motion.h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium flex items-center"
            >
              {showForm ? '× Cancel' : '+ Add Product'}
            </motion.button>
       
          </div>
          
        </div>
      </motion.div>
 

<button
  onClick={handleLogout}
  className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition "
>
  Logout
</button>

   
      <div className="max-w-7xl mx-auto px-4 py-8">
    
    
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Products', value: stats.total, icon: '📊', color: 'from-blue-400 to-blue-500' },
            { label: 'Active Products', value: stats.active, icon: '✅', color: 'from-green-400 to-green-500' },
            { label: 'Blocked Products', value: stats.blocked, icon: '🚫', color: 'from-red-400 to-red-500' },
            { label: 'Low Stock', value: stats.lowStock, icon: '⚠️', color: 'from-yellow-400 to-yellow-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl shadow-md text-white`}
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>


        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Product name"
                      required
                    />
                  </div>
                  
            
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
                    <input
                      type="number"
                      name="Quantity"
                      value={form.Quantity}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Quantity"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <div className="flex gap-2">
                    <input
  type="file"
  accept="image/*"
  onChange={handleChange}
/>
                    
                    </div>
                  </div>
                  
           
                  
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

   
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-md mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['all', 'active', 'blocked', 'lowStock'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filter === 'all' && 'All Products'}
                  {filter === 'active' && 'Active'}
                  {filter === 'blocked' && 'Blocked'}
                  {filter === 'lowStock' && 'Low Stock'}
                </button>
              ))}
            </div>
            
            <div className="w-full md:w-1/4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="priceAsc">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </motion.div>

  
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                      product.blocked ? 'ring-1 ring-red-200' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={product.image }
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      
                      />
                      {product.Quantity < 10 && (
                        <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          Low Stock
                        </span>
                      )}
                      {product.blocked && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-md font-bold">BLOCKED</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h2>
                        <span className="text-green-600 font-bold">${product.price}</span>
                      </div>
                      
                      {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md mb-2">
                          {product.category}
                        </span>
                      )}
                      
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Stock: <span className={product.Quantity < 10 ? 'text-amber-500 font-bold' : ''}>{product.Quantity}</span>
                        </span>
                        
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                          >
                            ✏️
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleBlock(product._id, product.blocked)}
                            className={`p-2 rounded-lg ${
                              product.blocked
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {product.blocked ? '🔓' : '🔒'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setConfirmDelete(product._id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            🗑️
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                  <span className="text-5xl mb-4">🔍</span>
                  <p className="text-xl font-medium">No products found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>


      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 text-2xl">
                    ⚠️
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemove(confirmDelete)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}