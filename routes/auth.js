const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

// register user
router.post(
    "/register", 
    [ 
    check("email", "Email is required").isEmail(),
    check("password", "password must be atleast 3 characters").isLength({ min: 3 })
    ],
    authController.register
);

// login
router.post(
    "/login", 
    [ 
    check("email", "Email is required").isEmail(),
    check("password", "password must be atleast 3 characters").isLength({ min: 3 })
    ],
    authController.login
);

// fetch user
router.get('/user/:id', auth, authController.getUser);

module.exports = router;