const { userModel } = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../utils/cloudinary");
const { transporter } = require("../utils/nodemailer");
const { otpModel } = require("../models/OtpModel");
require("dotenv").config()

const signup = async (req, res) => {

     try {
          const { userName, email, password, profilePic, otp, lastSeen } = req.body;
          const saltRounds = 10;

          const findOTP = await otpModel.findOne({ email })
          if (!findOTP) return res.status(201).json({ code: 76, message: "No OTP Found" })
          if (otp != findOTP.otp) return res.status(201).json({ code: 77, message: "Invalid OTP" })

          if (findOTP.otp == otp) {
               const hash = await bcrypt.hash(password, saltRounds)
               const userData = { userName, password: hash, email, profilePic, lastSeen }
               const saveRes = new userModel(userData)
               const deleteOTP = await otpModel.deleteOne({ email })
               if (saveRes) {
                    const token = jwt.sign({ email }, process.env.SECRET, {
                         expiresIn: "7d"
                    })
                    await saveRes.save()

                    const info = await transporter.sendMail({
                         from: '"HeyChat" <kusohail70@gmail.com>',
                         to: `${email}`,
                         subject: "Welcome to HeyChat!",
                         text: "Your HeyChat account has been created successfully.",
                         html: `
                              <!DOCTYPE html>
                              <html>
                                   <head>
                                   <meta charset="UTF-8" />
                                   <title>Welcome to HeyChat</title>
                                   <style>
                                        body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f9fafb;
                                        margin: 0;
                                        padding: 0;
                                        }
                                        .container {
                                        max-width: 600px;
                                        margin: 30px auto;
                                        background-color: #ffffff;
                                        border-radius: 10px;
                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                                        padding: 30px;
                                        text-align: center;
                                        }
                                        .header {
                                        background-color: #2563eb;
                                        padding: 20px;
                                        border-radius: 8px 8px 0 0;
                                        color: white;
                                        }
                                        .content {
                                        padding: 20px;
                                        }
                                        .footer {
                                        margin-top: 30px;
                                        font-size: 12px;
                                        color: #888888;
                                        }
                                        .cta-button {
                                        margin-top: 20px;
                                        display: inline-block;
                                        background-color: #2563eb;
                                        color: #ffffff;
                                        padding: 12px 24px;
                                        border-radius: 6px;
                                        text-decoration: none;
                                        font-weight: bold;
                                        }
                                   </style>
                                   </head>
                                   <body>
                                   <div class="container">
                                        <div class="header">
                                        <h1>🎉 Welcome to HeyChat!</h1>
                                        </div>
                                        <div class="content">
                                        <p>Hello ${userName},</p>
                                        <p>We’re excited to have you onboard. Your account has been successfully created.</p>
                                        <p>Now you can start chatting, making friends, and sharing moments!</p>
                                        <a href=${process.env.WEBSITE_LIVE_PATH} class="cta-button">Start Chatting</a>
                                        </div>
                                        <div class="footer">
                                        &copy; 2025 HeyChat. All rights reserved.
                                        </div>
                                   </div>
                                   </body>
                              </html>
                              `
                    });

                    res.status(200).json({
                         _id: saveRes._id,
                         profilePic: saveRes.profilePic,
                         email: saveRes.email,
                         token
                    })

               } else {
                    res.send({
                         code: 13,
                         msg: "Invalid USer"
                    })
               }
          }
     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)
     }



};

const login = async (req, res) => {
     const { email, password } = req.body;

     try {
          const userData = await userModel.findOne({ email })
          if (!userData) return res.status(201).json({ code: 12, msg: "User Not Found" })
          const verifyPass = await bcrypt.compare(password, userData.password)
          if (!verifyPass) return res.status(201).json({ code: 13, msg: "Invalid Credentials" })

          const token = jwt.sign({ email }, process.env.SECRET, {
               expiresIn: "7d"
          })
          res.status(200).json({
               msg: "Succesfully Logged In",
               profilePic: userData.profilePic,
               userName: userData.userName,
               email: userData.email,
               token
          })


     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)
     }


};

const profileUpdate = async (req, res) => {
     const { profilePic } = req.files;


     const { _id } = req.userData

     try {
          if (!_id || !profilePic) return res.status(400).json({ msg: "fields are required" })
          if (!profilePic) return res.status(400).json({ msg: "Profile Pic Required", code: 51 })
          const uploadRes = await cloudinary.uploader.upload(profilePic.tempFilePath, {
               folder: "chatAppUsers",
          });

          const updatedUser = await userModel.findByIdAndUpdate(_id, { profilePic: uploadRes.secure_url }, { new: true }).select("-password")

          res.status(200).json(updatedUser)
     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)
     }
}

const signupOTP = async (req, res) => {

     try {
          const { email, userName } = req.body;
          const user = await userModel.findOne({ email });
          if (user) return res.status(201).json({ code: 12, msg: "User Already Exists" })
          const otp = Math.floor(100000 + Math.random() * 900000);
          const deleteUserOTP = await otpModel.findOneAndDelete({ email })
          const saveOTP = await otpModel.create({ email, otp })
          const info = await transporter.sendMail({
               from: '"HeyChat" <kusohail70@gmail.com>',
               to: `${email}`,
               subject: "Account Creation",
               text: "Account Creation",
               html: `
                    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        padding: 30px;
      }
      .otp-box {
        font-size: 28px;
        font-weight: bold;
        color: #2563eb;
        background-color: #e0e7ff;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        letter-spacing: 4px;
        margin: 30px 0;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2 style="color: #1e40af;">Your Verification Code</h2>
      <p>Hello ${userName},</p>
      <p>
        Use the following One-Time Password (OTP) to verify create your account. This code is valid for the next 10 minutes:
      </p>

      <div class="otp-box">${otp}</div>

      <p>
        If you did not request this code, please ignore this email or contact support.
      </p>

      <p>Thanks,<br />HeyChat</p>

      <div class="footer">
        &copy; 2025 HeyChat. All rights reserved.
      </div>
    </div>
  </body>
</html>

          `,
          });
          res.status(200).json({
               code: 200,
               message: "OTP sent successfully",
          })
     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)

     }



}

const forgotPassword = async (req, res) => {
     try {
          const { email } = req.body;
          const user = await userModel.findOne({ email })
          if (!user) return res.status(201).json({ code: 201, message: "User not found" })
          const otp = Math.floor(100000 + Math.random() * 900000);
          const deleteUserOTP = await otpModel.findOneAndDelete({ email })
          const setOtp = otpModel.create({ email, otp })
          const info = await transporter.sendMail({
               from: '"HeyChat" <kusohail70@gmail.com>',
               to: `${email}`,
               subject: "Forgot Password",
               text: "Reset Forgot Password",
               html: `
                    <!DOCTYPE html>
                         <html lang="en">
                         <head>
                              <meta charset="UTF-8" />
                              <title>Password Reset OTP</title>
                              <style>
                              body {
                                   font-family: 'Segoe UI', sans-serif;
                                   background-color: #f4f4f7;
                                   margin: 0;
                                   padding: 0;
                                   color: #333;
                              }
                              .container {
                                   max-width: 600px;
                                   margin: 40px auto;
                                   background-color: #ffffff;
                                   padding: 30px;
                                   border-radius: 10px;
                                   box-shadow: 0 6px 18px rgba(0,0,0,0.1);
                              }
                              h2 {
                                   color: #4f46e5;
                                   margin-bottom: 10px;
                              }
                              .otp-box {
                                   background-color: #f0f0ff;
                                   border: 2px dashed #4f46e5;
                                   padding: 16px;
                                   text-align: center;
                                   font-size: 24px;
                                   font-weight: bold;
                                   letter-spacing: 4px;
                                   margin: 20px 0;
                                   border-radius: 8px;
                              }
                              p {
                                   font-size: 16px;
                                   line-height: 1.6;
                              }
                              .footer {
                                   font-size: 13px;
                                   color: #777;
                                   margin-top: 30px;
                                   text-align: center;
                              }
                              </style>
                         </head>
                         <body>
                              <div class="container">
                              <h2>Reset Your Password</h2>
                              <p>Hello, ${user.userName}</p>
                              <p>We received a request to reset the password for your <strong>HeyChat</strong> account.</p>
                              <p>Please use the OTP below to reset your password. This OTP is valid for <strong>10 minutes</strong>:</p>
                              <div class="otp-box">${otp}</div>
                              <p>If you did not request this, you can safely ignore this email.</p>
                              <div class="footer">
                                   <p>— The HeyChat Team</p>
                                   <p>Need help? Contact us at support@heychat.com</p>
                              </div>
                              </div>
                         </body>
                         </html>

          `,
          });
          return res.status(200).json({
               msg: "Otp Sent"
          });
     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)
     }
}

const forgotPasswordOtpCheck = async (req, res) => {
     try {
          const { otp, email, setPasswordDB, password } = req.body;
          const saltRounds = 10;
          if (setPasswordDB == 0) {
               const user = await otpModel.findOne({ email })
               if (!user) return res.status(201).json({ code: 202, msg: "No Otp Found" })
               if (otp != user.otp) return res.status(201).json({ code: 201, msg: "Invalid Otp" })
               await otpModel.deleteOne({ email })
               return res.status(200).json({
                    msg: "Otp Verified"
               })
          }
          else if (setPasswordDB == 1) {
               if (password) {
                    const hashPass = await bcrypt.hash(password, saltRounds);
                    const setNewPass = await userModel.findOneAndUpdate({ email }, { $set: { password: hashPass } }, { new: true })
                    return res.status(200).json({ message: "Password Reset Successfully" })
               } else {
                    return res.status(201).json({ code: 208, msg: "Somthing went wrong" })
               }
          }
     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)
     }
}

const getProfile = async (req, res) => {
     try {
          const { _id } = req.userData

          const user = await userModel.findById(_id).select("-password")
          if (!user) return res.status(201).json({ message: "Invalid User" })
          res.status(200).json(user)
     } catch (error) {
          res.send({
               msg: error.message
          })
          console.log(error.message)
     }
}
module.exports = { signup, login, profileUpdate, signupOTP, forgotPassword, forgotPasswordOtpCheck, getProfile }