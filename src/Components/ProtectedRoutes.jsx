
import { Navigate } from 'react-router-dom';
import { useUser } from './Usercontext';



const ProtectedRoute = ({ children }) => {
 
const { user, loading } = useUser();

  if (loading) {
    return
  }

  if (!user) {
    return <Navigate to="/login" replace />; 
  }
  if (user.role=="user") 
  {
    return <Navigate to="/" replace />
  }
  // if (user.role=="admin")
  // {
  //    return<Navigate to ="/dashboard" replace />
  // }
 
  return children; 
};

const AdminRoute=({children})=>{
 
const { user, loading } = useUser();
    
  if (loading) {
    return
  }

  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  if (user.role != "admin") {
     return <Navigate to="/not-authorized" replace />;
  }
  return children; 

}


  
export {ProtectedRoute,AdminRoute,} ;
