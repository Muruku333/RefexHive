const router = require("express").Router();
const userController = require("../controllers/user");

router.route("/all_users").get(userController.getAllUsers);

module.exports = router;
