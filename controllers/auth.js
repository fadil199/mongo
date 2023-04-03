const  Auth  = require('../models/auth');
const  Profile  = require('../models/profile');
const  Token  = require('../models/token');
const roles = require('../utils/roles');
const userTypes = require('../utils/userType');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const email1 = require("../utils/sendEmail");
const multer = require("multer");
const upload = multer();
const imagekit = require("../utils/imagekit");

const {
  JWT_TOKEN,
  apiHost
} = process.env;


module.exports = {
    register: async (req, res, next) => {
        try {

            const {
                username,
                email,
                password,
                confirmPassword,
                thumbnail = 'https://www.vecteezy.com/vector-art/8442086-illustration-of-human-icon-vector-user-symbol-icon-modern-design-on-blank-background',
                role = roles.user,
                user_type = userTypes.basic,
                is_verified = 0,
              } = req.body;

              const exist = await Auth.findOne( { email: email } );
                if (exist)
                return res.status(400).json({
                status: false,
                message: "e-mail already in use!!!",
                });

                if (!validator.isEmail(email)) {
                return res.status(400).json({
                  status: false,
                  message: "Email is not valid",
                });
                }
        
              let strongPassword = new RegExp(
                "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
              );
              let check = strongPassword.test(password);
              if (!check)
                return res.status(400).json({
                  status: false,
                  message:
                    "Password min 6 character, include a minimum of 1 lower case letter [a-z], a minimum of 1 upper case letter [A-Z] , and a minimum of 1 numeric character [0-9]",
                });

              if (confirmPassword != password) {
                return res.status(400).json({status: false, message: 'password 1 & 2 doesnt match'})
              }

              const encr = await bcrypt.hash(password, 10);
              const data = await Auth.create({
                username,
                email,
                password: encr,
                confirmPassword: encr,
                thumbnail,
                role,
                user_type,
                is_verified,
              })

              const detail = await Profile.create({ 
                user_id: data._id,
                fullName: ' ',
                gender: ' ',
                country: ' ',
                province: ' ',
                city: ' ',
                address: ' ',
                phone: ' ',
               })

              const payload1 = { _id: data._id };
              const token = jwt.sign(payload1, JWT_TOKEN);
              const link = `${apiHost}/auth/verif?token=${token}`;

              const expired = await Token.create({
                user_id: data._id,
                token: token,
                expired: 0
              })

              const html = await email1.getHtml("email/helo.ejs", {
              user: {
                name: data.username,
                link: link,
              },
              });

              const response = await email1.sendEmail(
              `${data.email}`,
              "Verify Your Email Address",
              `${html}`
              );

            return res.status(201).json({
                status: true,
                message: 'berhasil menambahkan data',
                data: data
            })

        }catch (err){
            // next(err)
            const cari = await Auth.findOne({ email: req.body.email})
            if (err.message == 'invalid_grant' || err.message == 'invalid_request') {
              await Auth.deleteOne({ email: cari.email})
              await Profile.deleteOne({ user_id: cari._id})
            }

            return res.status(500).json({
              status: false,
              message: 'perbarui google playground'
            })
        }
    },
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;

        const usercompare = await Auth.findOne( { email: email });
        if (!usercompare) {
            return res.status(400).json({
                status: false,
                message: 'email wrong!'
            })
        }

        
        const pass = await bcrypt.compare(password, usercompare.password);
        if (!pass) {
          return res.status(400).json({
            status: false,
            message: 'wrong password!!'
          })
        }
        
        if (usercompare.is_verified == 0) 
        return res.status(400).json({
          status: false,
          message: 'Your account has not been verified. Please verify first!'
        });

        const payload = {
          _id: usercompare._id,
          username: usercompare.username,
          email: usercompare.email,
          role: usercompare.role,
          user_type: usercompare.user_type,
          is_verified: usercompare.is_verified,
        }

        const token = jwt.sign(payload, JWT_TOKEN);
        
        return res.status(200).json({
            status: 'sukses',
            message: 'berhasil masuk',
            data: {
                email: usercompare.email,
                jwt_token: token
            }
        })


      }catch (err){
        next(err)
      }
    },
    akunSaya: async (req, res, next) => {
      const user = req.user;
      
      try {
          return res.status(200).json({
              status: true,
              message: 'autentifikasi berhasil',
              data: user
                  
          });
      }catch (err) {
          next(err);
      }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token)
        return res.status(400).json({
          status: false,
          message: "invalid token",
          token,
        });

      const payload = jwt.verify(token, JWT_TOKEN);

      const expired = await Token.findOne(
        { 
          $and: [
              {
                  user_id: payload._id
              },
              {
                  token: token
              },
              {
                  expired: 1
              }
          ]  
          }
      )

      if (expired) return res.status(400).json({ status: false, message: 'your account has been verified' })

      const verif = await Auth.updateOne(
        {
          _id: payload._id
        },
        {
          is_verified: 1
        }
      );

      const verif1 = await Token.updateOne(
        {
         user_id: payload._id
        }
        ,
        {
          expired: 1
        }
      )

      return res.status(200).json({
        status: true,
        message: 'akun berhasil diverifikasi'
      });
    } catch (err) {
      next(err);
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      const {
        first_name,
        last_name,
        gender,
        country,
        province,
        city,
        address,
        phone,
      } = req.body;

      const _id = req.user._id;
      const exist = await Auth.findOne({ _id: _id });

      if (!exist)
        return res
          .status(400)
          .json({ status: false, message: "user not found!" });

      const detail_user = await Profile.updateOne(
        {
          user_id: exist._id,
        },
        {
          fullName: [first_name, last_name].join(" "),
          gender,
          country,
          province,
          city,
          address,
          phone,
        }
      );

      const updatedProfile = await Profile.findOne({ user_id: exist._id });

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (err) {
      next(err);
    }
  },
  myprofile: async (req, res, next) => {
    try{
      const _id = req.user._id;
      const data = await Profile.findOne({ user_id: _id})

      if (!data) return res.status(400).json({ status: false, message: 'user not found!' })

      return res.status(200).json({
        status: true,
        message: 'data found',
        data: data
      })
    }catch (err){
      next(err)
    }
  },
  changeImage: async (req, res, next) => {
    try{
      
      const _id = req.user._id;
      const exist = await Auth.findOne( { _id } );
      if (!exist) return res.status(400).json({ status: false, message: "user not found!"})

      let uploadedFile1 = null;
      if (req.file != undefined) {

        let image1 = new RegExp(
          "^.*\.(img|jpg|jpeg|png)$"
        );
        let check = image1.test(req.file.originalname);
        if (!check)
          return res.status(400).json({
            status: false,
            message:
              "Hanya file bertipe img, jpg, jpeg, dan png yang diizinkan",
          });
          
        const file = req.file.buffer.toString("base64");

        const uploadedFile = await imagekit.upload({
          file,
          fileName: Date.now() + '_' + req.file.originalname,
        });

        const image = uploadedFile.url;
        uploadedFile1 = await Auth.updateOne(
          {
            _id: _id
          },
          {
            thumbnail: image
          }
        )
      }
        const upload = await Auth.findOne({ _id: _id })
        return res.status(200).json({
          status: true,
          message: "success upload document",
          data: upload,
        });
    }catch (err){
      next(err)
    }
  }
}