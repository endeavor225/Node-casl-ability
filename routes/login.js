// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Route pour créer un user
router.post('/', async (req, res) => {
  const { username } = req.body;
  
  User.findOne({username: username})
  .then((user) => {
    if(!user) return res.status(404).json({msg: "User noot found"})

    const payload = {
      userId: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      isEditor: user.isEditor
    };

    const accessToken = jwt.sign(payload, 'ACCESS_TOKEN_SECRET', { expiresIn: '365d' });
    res.status(200).json(accessToken)
  })
});

module.exports = router;
