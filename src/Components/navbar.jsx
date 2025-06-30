


import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../Components/Usercontext';
import { motion } from 'framer-motion';
import axios from "axios"
import { href, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

import { useState,useEffect } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/all-products' },
  { name:"About",href:"/about"}
];


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
 


export default function Header() {
  const { user } = useUser();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);



  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/cart/${user._id}`);
   
   
        setCartCount(res.data.cartItems.length)
      } catch (err) {
        console.error('Failed to fetch cart:', err);
   
      }
    };
    if (user) fetchCart();
  }, [user]);

  return (
    <Disclosure as="nav" className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
      
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-gray-700 focus:outline-none">
              <Bars3Icon className="block size-6" />
              <XMarkIcon className="hidden size-6" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium transition'
                      )}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user ? (
              <div className='flex gap-5'>

<a href="/cart" className="relative">
  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black transition" />

  {cartCount > 0 && (
    <>

      <span className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 opacity-75 animate-ping"></span>


      <span className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold shadow-lg ring-2 ring-white">
        {cartCount}
      </span>
    </>
  )}
</a>



                <p className="text-base font-medium text-gray-800 mr-4">Hi, {user.name}</p>
              </div>
            ) : (
              <a href="/signup">
                <button className="bg-black text-white px-4 py-2 rounded-md text-sm">
                  Sign In
                </button>
              </a>
            )}
  
            {user && (
              <div>
             
               
              <Menu as="div" className="relative ml-3">
               
                <MenuButton>
                  <motion.div
                    initial={{ x: '10vw', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'tween', ease: 'easeOut', duration: 2 }}
                    className="flex flex-col justify-between w-8 h-6 cursor-pointer"
                  >
                    <div className="w-8 h-0.5 bg-gray-600"></div>
                    <div className="w-8 h-0.5 bg-gray-600"></div>
                    <div className="w-8 h-0.5 bg-gray-600"></div>
                  </motion.div>
                </MenuButton>

                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        Your Profile
                      </a>
                    )}
                  </MenuItem>
              
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/logout"
                        className={`block px-4 py-2 text-sm text-red-600 ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        Log out
                      </a>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
           </div> )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}

