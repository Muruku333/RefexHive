const router = require("express").Router();
const userController = require("../controllers/user");
const validation = require("../middlewares/user/validator");
const auth = require("../middlewares/auth");
const uploadPhoto = require("../middlewares/user/uploadPhoto");
const Role = require("../utils/userRoles");

router
  .route("/users")
  .post(
    auth.authCheck,
    auth.authRole([Role.Admin]),
    uploadPhoto,
    validation.createUserSchema,
    userController.createUser
  )
  .get(auth.authCheck, auth.authRole([Role.Admin]), userController.listUsers);

router
  .route("/users/:id")
  .get(auth.authCheck, auth.authRole([Role.Admin]), userController.detailUser)
  .put(
    auth.authCheck,
    auth.authRole([Role.Admin]),
    // validation.updateUserSchema,
    userController.updateUser
  )
  .patch(
    auth.authCheck,
    auth.authRole([Role.Admin]),
    uploadPhoto,
    userController.updateUser
  )
  .delete(
    auth.authCheck,
    auth.authRole([Role.Admin]),
    userController.deleteUser
  );

router.post(
  "/change_password",
  auth.authCheck,
  validation.validateChangePassword,
  userController.changePassword
);

module.exports = router;
