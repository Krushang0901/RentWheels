const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email)
      const user =  await User.findOne({ email });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

  const updateProfile = async (req, res) => {
    const { email,firstName, lastName, dateOfBirth, phoneNumber, address, city, country, zipCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        user.city = city || user.city;
        user.country = country || user.country;
        user.zipCode = zipCode || user.zipCode;
  
        const updatedUser = await user.save();
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

  const changePassword = async (req, res) => {
    const { currentPassword, newPassword,email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(currentPassword,user.password))) {
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(400).json({ message: 'Current password is incorrect' });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const addUser = async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    
    try {
      const user = new User({
        username,
        email,
        password,isAdmin
      });
      user.password = await bcrypt.hash(password, 10);

      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  const deleteUser = async (req, res) => {
    const { email } = req.body;
  
    try {
      await User.findOneAndDelete({ email });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const adminChangeUserProfile = async (req, res) => {
    const { email, username, isAdmin } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user) {
        user.email = email || user.email;
        user.username = username || user.username;
        user.isAdmin = isAdmin;
  
        const updatedUser = await user.save();
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const getUsers = async (req, res) => {
    try {
      const user =  await User.find({});
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  module.exports = {
    getUser,
    updateProfile,
    changePassword,
    addUser,
    deleteUser,
    getUsers,adminChangeUserProfile
  };
  