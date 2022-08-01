const Admin = require("../models/admin.models");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  Admin.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    } else if (!validateEmail(req.body.email)) {
      return res.status(404).json({ message: "Please enter valid email" });
    } else {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      let admin = new Admin({
        name,
        email,
        password,
      });
      admin
        .save()
        .then((data) => {
          console.log(data);
          res.status(201).json({ message: "success", data });
        })
        .catch((e) => res.status(500).json({ error: e }));
    }
  });
};

const AdminLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const filter = { email: email };
  Admin.find(filter).then(async (result) => {
    if (result.length == 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Incorrect email" });
    } else {
      const user = result[0];
      const user_data = {
        user_id: result[0]._id,
      };
      // let check = await checkPswd(user.password, password);
      if (email !== user.email) {
        return res.status(404).json({ message: "Incorrect email" });
      }
      if (password !== user.password) {
        return res.status(404).json({ message: "Incorrect password" });
      }
      // if (!check) {
      // }
      let accessToken = jwt.sign({ user_data }, "access-key-secrete", {
        expiresIn: "2d",
      });
      // let refreshToken = jwt.sign({ user }, "refresh-key-secrete", {
      //   expiresIn: "7d",
      // });

      const update = {
        access_token: accessToken,
        //refresh_token: refreshToken,
      };

      Admin.findOneAndUpdate(filter, update, { new: true }).then(
        (result) => {}
      );

      const tokens = {
        accessToken,
        // refreshToken,
      };
      return res.status(200).json({
        status: "success",
        data: tokens,
        message: "Logged in successfully",
      });
    }
  });
};

module.exports = {
  createAdmin,
  AdminLogin,
};
