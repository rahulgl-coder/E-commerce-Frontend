


import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './Components/Usercontext';
import { ProductProvider } from './Components/Productcontext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter> 
      <UserProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </UserProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
