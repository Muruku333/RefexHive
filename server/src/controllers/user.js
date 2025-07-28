const { User } = require("../models");
const status = require("../helpers/Response");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      if (!users) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(res, 200, "All Users", users);
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
};
