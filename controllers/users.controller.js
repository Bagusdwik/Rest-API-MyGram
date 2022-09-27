const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt.func");
class Users {
  async getAllUsers(req, res) {
    const result = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      data: result,
    });
  }

  async insertUser(req, res) {
    const {
      email,
      full_name,
      username,
      password,
      profile_image_url,
      age,
      phone_number,
    } = req.body;

    try {
      const result = await User.create({
        email,
        full_name,
        username,
        password,
        profile_image_url,
        age,
        phone_number,
      });

      res.status(201).send({
        data: result,
      });
    } catch (err) {
      res.status(400).send({
        status: "failed",
        total: 1,
        messsage: err,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email: email_body, password: password_body } = req.body;
      const { email, password } = await User.findOne({
        where: { email: email_body },
      });

      const match = await bcrypt.compare(password_body, password);

      const token = jwt.signJwt({ email, password });

      if (!match) {
        throw new Error("Email/password does not match");
      }

      res.send({
        status: "success",
        token,
      });
    } catch (err) {
      res.send({
        status: "failed",
        message: err.message,
      });
    }
  }
}

module.exports = new Users();
