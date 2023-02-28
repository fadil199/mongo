const  Auth  = require('../models/auth')
const roles = require('../utils/roles');
const userTypes = require('../utils/userType');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const email1 = require("../utils/sendEmail");

const {
  JWT_TOKEN,
  apiHost
} = process.env;


module.exports = {
    register: async (req, res, next) => {
        // const user1 = new Auth(req.body);
        try {

            const {
                username,
                email,
                password,
                confirmPassword,
                thumbnail = 'saawfawd',
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

              const payload1 = { email: data.email };
              const token = jwt.sign(payload1, JWT_TOKEN);
              const link = `${apiHost}/auth/verif?token=${token}`;

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
            next(err)
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
          id: usercompare.id,
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
    akunSaya: (req, res, next) => {
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

      const verif = await Auth.updateOne(
        {
          email: payload.email
        },
        {
          is_verified: 1
        }
      );

      return res.status(200).json({
        status: true,
        message: 'akun berhasil diverifikasi'
      });
    } catch (err) {
      next(err);
    }
  }
}