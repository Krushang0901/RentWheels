const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let user = new User({ username, email, password });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(201).json({
      message: 'User registered successfully'
     
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' });
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: 'Login successful',
        user : { id: user._id,
          username: user.username,
          email: user.email,isAdmin:user?.isAdmin 
        }
       
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' });
  }
};
