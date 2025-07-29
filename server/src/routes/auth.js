const router = require("express").Router();
const authController = require("../controllers/auth");
const {
  createUserSchema,
  validateLogin,
  createClientSchema,
  validateGetAccessToken,
} = require("../middlewares/user/validator");
const auth = require("../middlewares/auth");
const { SuperAdmin } = require("../utils/userRoles");

router.post("/login", validateLogin, authController.login);
router.post("/logout", auth.authCheck, authController.logout);
router.post("/refresh_token", authController.refreshToken);

router.post(
  "/client",
  auth.authCheck,
  createClientSchema,
  authController.createClient
);
router.post(
  "/access_token",
  validateGetAccessToken,
  authController.getAccessToken
);

module.exports = router;
