const express = require('express');
const router = express.Router();
const {  getUser,
    updateProfile,
    changePassword,
    addUser,
    deleteUser,
    getUsers,adminChangeUserProfile} = require('../controllers/userController');

router.post('/getuser', getUser);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

router.put('/adminUpdateProfile', adminChangeUserProfile);
router.post('/adduser', addUser);
router.delete('/deleteuser', deleteUser);
router.get('/getUsers',getUsers)
module.exports = router;
