


// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Signup from './Components/Signup';
// import Homepage from './Components/Landingpage';
// import Login from './Components/Login';
// import Logout from './Components/Logout';
// import AdminDashboard from "./Components/Admin";
// import ProductDetail from './Components/Productdetail';
// import AllProductsPage from './Components/All_product';
// import About from './Components/About';
// import OrderConfirmPage from './Components/Orderconfirmation';
// import CartPage from './Components/cart';
// import ProfilePage from './Components/Profile';
// import { Toaster } from 'react-hot-toast';
// import { useUser, UserProvider } from './Components/Usercontext';
// import{ ProtectedRoute,AdminRoute} from './Components/ProtectedRoutes';
// import NotAuthorized from './Components/NotAuthorized';


// function App() {
//   return (
//     <UserProvider>
//       <Router>
//         <Toaster position="top-right" reverseOrder={false} />
//         <Routes>
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/" element={<Homepage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/logout" element={<Logout />} />
//           <Route path="/not-authorized" element={<NotAuthorized />} />

        
//           <Route path="/product/:id" element={<ProductDetail />} />
//           <Route path="/all-products" element={<AllProductsPage />} />

//           <Route
//             path="/orderconfirmation/:id"
//             element={
//               <ProtectedRoute>
//                 <OrderConfirmPage />
//               </ProtectedRoute>
//             }
//           />

//        <Route
//             path="/dashboard"
//             element={
//               <AdminRoute>
//                 <AdminDashboard />
//               </AdminRoute>
//             }
//           />

//           <Route
//             path="/cart"
//             element={
//               <ProtectedRoute>
//                 <CartPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/about" element={<About />} />
//           <Route path="/profile" element={<ProfilePage />} />
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;


import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Homepage from './Components/Landingpage';
import Login from './Components/Login';
import Logout from './Components/Logout';
import AdminDashboard from "./Components/Admin";
import ProductDetail from './Components/Productdetail';
import AllProductsPage from './Components/All_product';
import About from './Components/About';
import OrderConfirmPage from './Components/Orderconfirmation';
import CartPage from './Components/cart';
import ProfilePage from './Components/Profile';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoutes';
import NotAuthorized from './Components/NotAuthorized';
import Resetpassword from './Components/Newpassword';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
         <Route path="/reset_password/:id"element={<Resetpassword/>}/>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/all-products" element={<AllProductsPage />} />

        <Route
          path="/orderconfirmation/:id"
          element={
       
              <OrderConfirmPage />
       
          }
        />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/cart"
          element={
         
              <CartPage />
       
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
