
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const User = require('../../models/User');

//@desc Register
router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ emailId: req.body.emailId}).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        avatar,
        password: req.body.password,
        departmentName: req.body.departmentName
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
      //TODO uncomment below lines to implement mail verification

      // const verifyToken = new VerifyToken({
      //     _userId: user._id,
      //     token:crypto.randomBytes(16).toString('hex')
      //   });
      // verifyToken.save().then(token => res.json(token))
      //   .catch(err => console.log(err));
      // // Send the email
      // const transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
      // const mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification' +
      //     ' Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
      // transporter.sendMail(mailOptions, err => {
      //   if (err) { return res.status(500).send({ msg: err.message }); }
      //   res.status(200).send('A verification email has been sent to ' + user.email + '.');
      // });
    }
  });
});

//@desc Login
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const emailId = req.body.emailId;
  const password = req.body.password;

  User.findOne({ emailId }).then(user => {

    if(!user) {
      errors.emailId = 'User not Found';
      return res.status(400).json(errors);
    }

    bcrypt.compare(password,user.password).then(isMatch => {
      if(isMatch) {
        //TODO unComment below lines to implement mail verification

        // if(!user.isVerified) {
        //   return res.status(401).json({type: not-Verified, msg: 'Your account is not verified'});
        // }
        const payload = {id: user.id, avatar: user.avatar};
        //TODO change secret key and signIn options
        jwt.sign(payload,keys.secretOrKey,{expiresIn: '12h'},
          (err,token) => {
          res.json({
            success: true,
            token: 'Bearer '+token
          });
        });
      } else {
        errors.password = 'Incorrect Password';
        return res.status(400).json(errors.password);
      }
    })
  })
});


//Logged In Session currentUser
router.get('/current',passport.authenticate('jwt',{session: false}),
  (req,res) => {
  res.json({
    name: req.user.firstName+' '+req.user.lastName,
    email: req.user.emailId,
    department: req.user.departmentName
  });
  });

module.exports = router;