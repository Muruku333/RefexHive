const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { User, Client, Sequelize } = require("../models");
const status = require("../helpers/Response");
// const sendMail = require("../helpers/sendMail");
// const ecryption = require("../helpers/encryption");
// const Role = require("../utils/userRoles");
// const { Op, where } = require("sequelize");

const { APP_URL, ACCESS_SECRET, REFRESH_SECRET, DEFAULT_PASSWORD } =
  process.env;
const saltRounds = 10;

module.exports = {
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { email, password, remember } = req.body;
      const existingUser = await User.findOne({ where: { email } });

      if (!existingUser) {
        return status.ResponseStatus(res, 401, "Invalid email");
      }

      if (!existingUser.is_verified) {
        return status.ResponseStatus(res, 401, "Email not verified");
      }

      if (!existingUser.is_active) {
        return status.ResponseStatus(
          res,
          401,
          "You're deactivated by the admin. Please contact admin to login."
        );
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordMatch) {
        return status.ResponseStatus(res, 401, "Incorrect password");
      }

      // Payload for tokens
      const payload = {
        user_id: existingUser.id,
        role: existingUser.role,
        email: existingUser.email,
      };

      // Set access token (short-lived)
      const accessToken = jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: remember ? "7d" : "15m", // longer if remember is true
      });

      // Set refresh token (longer lifespan)
      const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: remember ? "30d" : "1d",
      });

      // You can optionally store the refresh token in DB here if you want blacklist control

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
      });

      // Send both tokens
      return res.status(200).json({
        status: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          photo: existingUser.photo,
        },
      });
    } catch (error) {
      console.error("Login error:", error.message);
      return status.ResponseStatus(res, 500, "Internal Server Error", {
        error: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return status.ResponseStatus(res, 400, "Refresh token not provided");
      }

      // Optional: Invalidate token using in-memory blacklist
      //   try {
      //     const payload = jwt.verify(refreshToken, REFRESH_SECRET);
      //     blacklist.add(refreshToken); // Just an example; Redis is recommended
      //   } catch (err) {
      //     return status.ResponseStatus(res, 401, "Invalid refresh token");
      //   }

      // Clear cookies on client
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return status.ResponseStatus(res, 200, "Logged out successfully");
    } catch (error) {
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;

      if (!oldRefreshToken) {
        return status.ResponseStatus(res, 400, "Refresh token not provided");
      }

      // Verify the refresh token
      let payload;
      try {
        payload = jwt.verify(oldRefreshToken, REFRESH_SECRET);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return status.ResponseStatus(res, 401, "Refresh token expired");
        }
        return status.ResponseStatus(res, 403, "Invalid refresh token");
      }

      // Optional: blacklist the old token (if Redis used)
      // await redisClient.setEx(`bl_refresh_${oldRefreshToken}`, 30 * 24 * 60 * 60, "true");

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { user_id: payload.user_id, role: payload.role, email: payload.email },
        ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        { user_id: payload.user_id, role: payload.role, email: payload.email },
        REFRESH_SECRET,
        { expiresIn: "1d" }
      );

      // Set cookies (secure only in production)
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      });

      return status.ResponseStatus(res, 200, "Token refreshed successfully");
    } catch (error) {
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  //   register: async (req, res) => {
  //     try {
  //       const errors = validationResult(req);
  //       if (!errors.isEmpty()) {
  //         return status.ResponseStatus(res, 400, "Validation Failed", errors);
  //       }
  //       const {
  //         firstName,
  //         lastName,
  //         email,
  //         phone,
  //         userName,
  //         password = DEFAULT_PASSWORD,
  //         role = Role.User,
  //       } = req.body;
  //       const user = {
  //         first_name: firstName,
  //         last_name: lastName,
  //         email: email,
  //         phone: phone,
  //         user_name: userName,
  //         password: password,
  //         role: role,
  //       };
  //       const result_email = await userModel.getUsersByCondition({ email });
  //       const result_username = await userModel.getUsersByCondition({
  //         user_name: user.user_name,
  //       });
  //       if (result_email.length > 0) {
  //         return status.ResponseStatus(res, 409, "Email already exists");
  //       } else if (result_username.length > 0) {
  //         return status.ResponseStatus(res, 409, "Username already exists");
  //       } else {
  //         // Hash the password before storing in the database
  //         const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
  //         user.password = hashedPassword;
  //         // console.log(user);
  //         const createdUser = await userModel.createUser(user);
  //         // console.log(createdUser);
  //         if (createdUser.insertId > 0) {
  //           const token = jwt.sign({ id: createdUser.insertId }, APP_KEY, {
  //             expiresIn: "1d",
  //           });

  //           const mailSubject = "Account created - GAMA AirOps";
  //           const verifyLink = `${FRONT_END_URL}/mail_verification/${token}`;

  //           const mailContent = `<p>Hi ${user.first_name} ${user.last_name}, Please Verify</p>
  //                 <p>We've created a user account for you in GAMA AirOPS.</p>
  //                 <p>Your login details:</p>
  //                 <ul>
  //                     <li>Username: ${user.email}</li>
  //                     <li>Password: ${password}</li>
  //                 </ul>
  //                 <p>Please click on the link to verify your email and log in at GAMA AirOPS <a href="${verifyLink}"> Click Here </a> and change your password for security.</p>
  //                 <p>If you need assistance, contact us at dinesh.r@refex.co.in or 9361083127.</p>
  //                 <div style="text-align: center;">
  // <a href="https://sparzana.com/">
  //     <img src="https://nxtbot.refex.group/sparzanalogo.png" alt="Sparzana Aviation" style="max-width: 100px;">
  // </a>
  // </div>
  //                 <p>Best regards,</p>
  //                 <p>Dinesh Ravi<br>Jr Software Developer<br>Refex Groups</p>`;

  //           sendMail(
  //             user.email,
  //             mailSubject,
  //             mailContent,
  //             async (error, info) => {
  //               if (error) {
  //                 await userModel.deleteUserById(createdUser.insertId);
  //                 return status.ResponseStatus(
  //                   res,
  //                   400,
  //                   "User Registration Failed",
  //                   { error: error }
  //                 );
  //               } else {
  //                 return status.ResponseStatus(
  //                   res,
  //                   201,
  //                   "User Registered Successfully",
  //                   { token: token, info: info }
  //                 );
  //               }
  //             }
  //           );
  //         } else {
  //           return status.ResponseStatus(res, 400, "User Registration Failed");
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //       return status.ResponseStatus(res, 500, "Internal server error", {
  //         error: error.message,
  //       });
  //     }
  //   },
  //   verifyMail: async (req, res) => {
  //     try {
  //       const { token } = req.params;
  //       // Verify token
  //       const user = jwt.verify(token, APP_KEY);
  //       // Update user's verification status
  //       const result = await userModel.updateUserById(user.id, {
  //         is_verified: 1,
  //       });
  //       if (result.affectedRows > 0) {
  //         return status.ResponseStatus(
  //           res,
  //           200,
  //           "E-mail verified successfully..!"
  //         );
  //       } else {
  //         return status.ResponseStatus(res, 401, "E-mail verification failed..!");
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //       return status.ResponseStatus(res, 500, "Internal server error", {
  //         error: error.message,
  //       });
  //     }
  //   },
  //   forgotPassword: async (req, res) => {
  //     try {
  //       const { email } = req.body;
  //       const user = await User.findOne({ where: { email } });

  //       if (!user) {
  //         return status.ResponseStatus(res, 404, "Email not exist");
  //       }

  //       const token = jwt.sign({ user }, APP_KEY, { expiresIn: "30m" });
  //       const resetLink = `${APP_URL}/reset_password/${token}`;

  //       const mailSubject = "Password Reset Request - GAMA AirOps";
  //       const mailContent = `
  //       <p>Dear ${user.full_name},</p>
  //       <p>We have received a request to reset your password for GAMA AirOps. To proceed, please click the following link:</p>
  //       <p><a href="${resetLink}">Reset Password</a></p>
  //       <p>If you did not initiate this password reset, kindly disregard this email.</p>
  //       <p>Thank you for using GAMA AirOps.</p>
  //       <div style="text-align: center;">
  //   <a href="${APP_URL}">
  //       <img src="${APP_URL}/assets/logo/logo.png" alt="Sparzana Aviation" style="max-width: 100px;">
  //   </a>
  // </div>
  //   `;

  //       sendMail(email, mailSubject, mailContent, (error, info) => {
  //         if (error) {
  //           return status.ResponseStatus(
  //             res,
  //             400,
  //             "Password reset link mail failed to send",
  //             error
  //           );
  //         } else {
  //           return status.ResponseStatus(
  //             res,
  //             200,
  //             "Password reset link mail sent successfully",
  //             info
  //           );
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error.message);
  //       return status.ResponseStatus(res, 500, "Internal server error", {
  //         error: error.message,
  //       });
  //     }
  //   },
  //   resetPassword: async (req, res) => {
  //     try {
  //       const { token } = req.params;
  //       const { password, confirm_password } = req.body;
  //       if (password !== confirm_password) {
  //         return status.ResponseStatus(
  //           res,
  //           400,
  //           "Password and confirm password doesn't match"
  //         );
  //       }
  //       const hashedPassword = bcrypt.hashSync(confirm_password, saltRounds);
  //       // Verify token
  //       const decoded = jwt.verify(token, APP_KEY);
  //       const result = await User.update(
  //         { password: hashedPassword },
  //         { where: { id: decoded.user.id } }
  //       );
  //       if (result) {
  //         return status.ResponseStatus(res, 200, "Password reseted successfully");
  //       } else {
  //         return status.ResponseStatus(res, 400, "Password reset failed");
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //       return status.ResponseStatus(res, 500, "Internal server error", {
  //         error: error.message,
  //       });
  //     }
  //   },
  //   verifyToken: async (req, res) => {
  //     try {
  //       const { token } = req.params;
  //       // Verify token
  //       const decoded = jwt.verify(token, APP_KEY);
  //       return status.ResponseStatus(res, 200, "Valid Token", decoded);
  //     } catch (error) {
  //       if (error.name === "TokenExpiredError") {
  //         return status.ResponseStatus(res, 401, "Token has expired!");
  //       } else {
  //         return status.ResponseStatus(res, 401, "Invalid token!");
  //       }
  //     }
  //   },
  createClient: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { name, secret, associate_user_id } = req.body;
      const { user_id } = req.session_data;

      const associatedUser = await User.findByPk(associate_user_id);
      if (!associatedUser) {
        return status.ResponseStatus(res, 404, "Associated user not found");
      }

      if (!associatedUser.is_active) {
        return status.ResponseStatus(res, 403, "Associated user is inactive");
      }

      const existingClient = await Client.findOne({
        where: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          name.toLowerCase()
        ),
      });

      if (existingClient) {
        return status.ResponseStatus(res, 409, "Client name already exists");
      }

      const hashedSecret = bcrypt.hashSync(secret, saltRounds);

      const client = await Client.create({
        name,
        secret: hashedSecret,
        associate_user_id,
        created_by: user_id,
        updated_by: user_id,
      });

      return status.ResponseStatus(
        res,
        201,
        "Client created successfully",
        client
      );
    } catch (error) {
      console.error("Create Client Error:", error.message);
      return status.ResponseStatus(res, 500, "Internal Server Error", {
        error: error.message,
      });
    }
  },
  getAccessToken: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const { client_id, client_secret } = req.body;

      const client = await Client.findByPk(client_id, {
        include: [
          {
            association: "associate_user",
            attributes: ["id", "name", "email", "role", "is_active"],
          },
        ],
      });

      if (!client) {
        return status.ResponseStatus(res, 404, "Client not found");
      }

      const associatedUser = client.associate_user;
      if (!associatedUser || !associatedUser.is_active) {
        return status.ResponseStatus(res, 403, "Associated user is inactive");
      }

      const isSecretValid = await bcrypt.compare(client_secret, client.secret);
      if (!isSecretValid) {
        return status.ResponseStatus(res, 401, "Invalid client credentials");
      }

      // Machine-to-machine session payload
      const payload = {
        user_id: associatedUser.id,
        role: associatedUser.role,
        email: associatedUser.email,
        client_id: client.id,
      };

      const accessToken = jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m",
      });

      return status.ResponseStatus(res, 200, "Access token issued", {
        token_type: "Bearer",
        expires_in: 900, // 15 min in seconds
        access_token: accessToken,
      });
    } catch (error) {
      console.error("Access Token Error:", error.message);
      return status.ResponseStatus(res, 500, "Internal Server Error", {
        error: error.message,
      });
    }
  },
};
