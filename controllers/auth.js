const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const emailExistence = require('email-existence');

exports.register = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }

    emailExistence.check(email, function(error, response){
        if(error) return res.status(400).json({error:'something went wrong'});
        console.log('res: '+response);

        if(response) {
            User.findOne({ where: { email: email } }).then(user => {
                if(user) return res.status(400).json({error:'User already Exist'});
                
                bcrypt.hash(password, 10).then((hash) => {
                    User.create({
                        email: email,
                        password: hash,
                    })
                    .then(user => {
                        jwt.sign(
                            { id: user.id, email: user.email },
                            'supersecret',
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    msg: "USER REGISTERED, Notification Sent to your Email-Address",
                                    token,
                                    id: user.id,
                                    email: user.email
                                })
                            }
                        )
                    })
                    .then(() => {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'fullstack.assignment@gmail.com',
                                pass: 'fullstack@assignment1'
                            }
                        });
        
                        const mailOptions = {
                            from: 'fullstack.assignment@gmail.com',
                            to: email,
                            subject: 'Registration',
                            html: '<h1>Welcome To Zocket!!</h1>'
                        };
        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    })
                    .catch((err) => {
                      if (err) {
                        res.status(400).json({ error: err });
                      }
                    });
                });
            })
        } else {
            res.status(400).json({error: 'InValid Email Address, Please Enter Valid Email Address'});
        }
    });
};

exports.login = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }

    User.findOne({ where: { email: email } }).then(user => {
        if(!user) return res.status(400).json({error:"User Doesn't Exist"});

        const dbPassword = user.password;
        bcrypt.compare(password, dbPassword).then((match) => {
            if(!match) return res.status(400).json({ error: 'Invalid credentials' });

            jwt.sign(
                { id: user.id, email: user.email  },
                'supersecret',
                { expiresIn: 3600 },
                (err, token) => {
                    if(err) throw err;
                    res.json({
                        msg: "USER LOGEDIN",
                        token,
                        user: {
                            id: user.id,
                            email: user.email
                        }
                    })
                }
            )
        })
    })
};

exports.getUser = async (req, res) => {
    const userId = req.params.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) res.status(400).json({ error: "User Doesn't Exist" });

    res.json({ id: user.id, email: user.email });
};