import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUserProfile(user.email);
    }
  }, [user, navigate]);

  const fetchUserProfile = async (email) => {
    setLoading(true);
    const backend = 'http://localhost:5000';
    try {
      const response = await fetch(`${backend}/api/user/getuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const userProfile = await response.json();
        if (userProfile.dateOfBirth) {
          userProfile.dateOfBirth = new Date(userProfile.dateOfBirth).toISOString().split('T')[0];
        }
        setUser(userProfile);
        setPasswordData((prevPasswordData) => ({
          ...prevPasswordData,
          email: userProfile.email,
        }));
      } else {
        toast.error('User profile not found. Please update your profile.');
      }
    } catch (error) {
      toast.error('Error fetching user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevPasswordData) => ({ ...prevPasswordData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const backend = 'http://localhost:5000';
    await fetch(`${backend}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    setLoading(false);
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    const backend = 'http://localhost:5000';
    const response = await fetch(`${backend}/api/user/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    const result = await response.json();
    if (response.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit} name="profile-form">
      <h2>Profile</h2>
      <div className="form-group">
        <label>First Name</label>
        <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value={userData.email} readOnly />
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input type="text" name="address" value={userData.address} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={userData.city} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" name="country" value={userData.country} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Zip Code</label>
        <input type="text" name="zipCode" value={userData.zipCode} onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving changes...' : 'Update'}</button>
    </form>
  );

  const renderChangePasswordForm = () => (
    <form onSubmit={handleChangePassword} name="change-password-form">
      <h2>Change Password</h2>
      <div className="form-group">
        <label>Current Password</label>
        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} />
      </div>
      <button type="submit">Change Password</button>
    </form>
  );

  return (
    <div className="profile-container">
      <ToastContainer />
      <div className="sidebar">
        <ul>
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</li>
          <li className={activeTab === 'changePassword' ? 'active' : ''} onClick={() => setActiveTab('changePassword')}>Change Password</li>
        </ul>
      </div>
      <div className="profile-content">
        {activeTab === 'profile' && renderProfileForm()}
        {activeTab === 'changePassword' && renderChangePasswordForm()}
      </div>
    </div>
  );
};

export default UserProfile;
