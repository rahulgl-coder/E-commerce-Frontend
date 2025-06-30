

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Components/Usercontext';
import ConfirmLogoutModal from './Logoutmodal';

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const handleConfirm = () => {
    logout();
    setShowModal(false);
    console.log("hello");
    
    // setTimeout(() => {
    //   // navigate('/');
    // }, 300);
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <>
      {showModal && (
        <ConfirmLogoutModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {!showModal && <p>Logging you out...</p>}
    </>
  );
};

export default Logout;
