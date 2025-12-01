import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token;
  };

  const fetchUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Send token
        },
      });

      const dataApi = await response.json();

      if (response.ok && dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      } else {
        console.error('Failed to fetch user details:', dataApi.message);
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Send token
        },
      });

      const dataApi = await response.json();

      if (response.ok && dataApi.success) {
        setCartProductCount(dataApi?.data?.count || 0);
      } else {
        console.error('Failed to fetch cart count:', dataApi.message);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails,
          cartProductCount,
          fetchUserAddToCart,
        }}
      >
        <ToastContainer position="top-center" />
        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-20">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
