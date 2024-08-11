import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import UserProfile from './pages/UserProfile';
import ContactUs from './pages/contact';
import CarList from './pages/CarList';
import Booking from './pages/Booking';
import MyCarBookings from './pages/MyCarBookings';
import Users from './pages/Users';
import Admin from './pages/Admin';
import BookedCar from './pages/BookedCar';
import { withAdminCheck, withUserCheck } from './components/RouteGuards';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './components/AuthContext';


const ProtectedUserProfile = withUserCheck(UserProfile);
const ProtectedCarList = withUserCheck(CarList);
const ProtectedAdmin = withAdminCheck(Admin);
const CarBook = withUserCheck(Booking);
const CarBookings = withUserCheck(MyCarBookings);
const UsersPage = withAdminCheck(Users);
const BookedCarUsers = withAdminCheck(BookedCar);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/LoginSignup" element={<LoginSignup />} />
              <Route path="/profile" element={<ProtectedUserProfile />} />
              <Route path="/carList" element={<ProtectedCarList />} />
              <Route path="/contactUs" element={<ContactUs />} />
              <Route path="/myCarBookings" element={<CarBookings />} />
              <Route path="/Admin" element={<ProtectedAdmin />} />
              <Route path="/booking/:id" element={<CarBook />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/bookedCars" element={<BookedCarUsers />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
