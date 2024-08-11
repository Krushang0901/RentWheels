import React, { useState,useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';


const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { user, login, loginAsAdmin } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backend = 'https://rentwheels.onrender.com';
    
    const url = isLogin ? `${backend}/api/auth/login` : `${backend}/api/auth/register`;
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(formData);

    try {
      const response = await fetch(url, { method, headers, body });
      const data = await response.json();

      if (response.ok) {

        toast.success(data.message);
        console.log(isLogin ? 'Logged in:' : 'Registered:', data);
        if(isLogin){
        login(data.user); 
        if (data.user?.isAdmin) {
          console.log("isAdmin");
          loginAsAdmin(data.user);
          return navigate("/Admin");
        }

          navigate('/');
        }
      } else {
        toast.error(data.message);
        console.error('Error:', data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='login-content'>
      <div className="login-container">
        <form className="form-login" onSubmit={handleSubmit}>
          <ul className="login-nav">
            <li className={`login-nav__item ${isLogin ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Sign In</a>
            </li>
            <li className={`login-nav__item ${!isLogin ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Sign Up</a>
            </li>
          </ul>
          {isLogin ? (
            <>
              <label htmlFor="login-input-email" className="login__label">
                Email
              </label>
              <input id="login-input-email" name="email" className="login__input" type="email" value={formData.email} onChange={handleInputChange} />
              <label htmlFor="login-input-password" className="login__label">
                Password
              </label>
              <input id="login-input-password" name="password" className="login__input" type="password" value={formData.password} onChange={handleInputChange} />
              <button className="login__submit" type="submit">Sign In</button>
            </>
          ) : (
            <>
              <label htmlFor="signup-input-user" className="login__label">
                Username
              </label>
              <input id="signup-input-user" name="username" className="login__input" type="text" value={formData.username} onChange={handleInputChange} />
              <label htmlFor="signup-input-email" className="login__label">
                Email
              </label>
              <input id="signup-input-email" name="email" className="login__input" type="email" value={formData.email} onChange={handleInputChange} />
              <label htmlFor="signup-input-password" className="login__label">
                Password
              </label>
              <input id="signup-input-password" name="password" className="login__input" type="password" value={formData.password} onChange={handleInputChange} />
              <button className="login__submit" type="submit">Sign Up</button>
            </>
          )}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginSignup;
