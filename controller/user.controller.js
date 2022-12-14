const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const Amount = require("../models/amount.models");
const ws = require("ws");
const OneSignal = require("onesignal-node");
const client = new OneSignal.Client(
  "a1c86044-240f-4885-ae93-f5bc754cb589",
  "OWY0MWU2OTUtZDg1MC00NzVkLWJiMDMtNGVjYTNkNmM2NzJh"
);

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1457829",
  key: "020e37d0408e81b95340",
  secret: "f410f09ad20e4236e8d3",
  cluster: "ap2",
  useTLS: true,
});

function sendPushNotification(token, text) {
  return new Promise((res, rej) => {
    const notification = {
      contents: {
        en: "faheem hello",
      },
      // include_player_ids: ["d803026f-a32c-4bcc-b77f-2bf6383af22c"],
      included_segments: ["Subscribed Users"],
    };

    return client
      .createNotification(notification)
      .then((response) => {
        return res(response);
      })
      .catch((e) => {
        return rej(e);
      });
  });
}

const signup = async (req, res) => {
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    } else if (!validateEmail(req.body.email)) {
      return res.status(404).json({ message: "Please enter valid email" });
    } else {
      const name = req.body.name;
      const email = req.body.email;
      const phone = req.body.phone;
      const amount = 0;
      const paid_amount = 0;
      const password = req.body.password;
      let user = new User({
        name,
        email,
        phone,
        amount,
        password,
        paid_amount,
      });
      user
        .save()
        .then((data) => {
          res.status(201).json({ message: "Created", data });
        })
        .catch((e) => res.status(500).json({ error: e }));
    }
  });
};
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const filter = { email: email };
  User.find(filter).then(async (result) => {
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

      User.findOneAndUpdate(filter, update, { new: true }).then((result) => {});

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

const logout = async (req, res) => {
  const user_id = req.user.user_data.user_id;
  const email = req.body.email;
  const filter = { _id: user_id };
  User.find(filter).then((result) => {
    const user = result[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const update = {
      access_token: "",
      // refresh_token: "",
    };
    User.findOneAndUpdate(filter, update, { new: true }).then((result) => {});

    return res.status(200).json({ message: "User logged out successfully" });
  });
};

function getByUserId(req, res) {
  let user_id = req.user.user_data.user_id;
  User.findById(user_id).then((data) => {
    const newData = {
      id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      amount: data.amount,
      paid_amount: data.paid_amount,
      total_amount: data.amount + data.paid_amount,
    };

    res.status(200).json({ status: "success", data: newData });
  });
}

function addAmount(req, res, next) {
  let user_id = req.user.user_data.user_id;
  User.findById(user_id).then((data) => {
    const newAmount = { amount: data.amount + req.body.amount };
    history(user_id, req.body.amount, req.body.date);
    User.findByIdAndUpdate(user_id, newAmount, (err, emp) => {
      if (err) {
        return res
          .status(500)
          .send({ error: "Problem with Updating the   Employee recored " });
      }
      res.send({ success: "Updation successfull" });
    });
  });
}

function users(req, res, next) {
  User.find({}).then((data) => {
    const newData = data?.map((i) => {
      return {
        id: i._id,
        name: i.name,
        email: i.email,
        phone: i.phone,
        amount: i.amount,
        paid_amount: i.paid_amount,
        total_amount: i.amount + i.paid_amount,
      };
    });
    sendPushNotification();
    // const client = new ws("ws://localhost:3000");

    // client.on("open", () => {
    //   // Causes the server to print "Hello"
    //   client.send("socket connected");
    // });
    pusher.trigger("my-channel", "my-event", {
      message: "hello world",
    });
    sendPushNotification,
      res.status(200).json({ status: "success", data: newData });
  });
}

function history(user, rate, date) {
  let amount = new Amount({
    user,
    rate,
    date,
  });
  amount.save().then((data) => {
    // res.status(200).json({ status: "success", data: data });
  });
}

function getAll(req, res, next) {
  let user_id = req.user.user_data.user_id;
  Amount.find({ user: user_id }).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function getByAmt(req, res) {
  let user_id = req.user.user_data.user_id;
  Amount.find({ user: user_id }).then((data) => {
    if (data[0].user == user_id) {
      const newData = data.filter((item) => item.date == req.body.date);
      res
        .status(200)
        .json({ status: "success", message: "available", data: newData });
    } else {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }
  });
}

const filterByDate = (req, res) => {
  let user_id = req.user.user_data.user_id;
  Amount.find({ user: user_id }).then((data) => {
    if (data[0].user == user_id) {
      var startDate = new Date(req.body.start_date);
      var endDate = new Date(req.body.end_date);

      var resultProductData = data.filter((a) => {
        var date = new Date(a.date);
        return date >= startDate && date <= endDate;
      });

      res.status(200).json({
        status: "success",
        message: "available",
        data: resultProductData,
      });
    } else {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }
  });
};

// function getById(req, res) {
//   Meals.findById(req.params.id).then((data) => {
//     res.status(200).json({ status: "success", data: data });
//   });
// }

function payAmount(req, res, next) {
  console.log("hai");
  console.log(req.body, "kk");
  let user_id = req.user.user_data.user_id;
  User.findById(user_id).then((data) => {
    if (req.body.paid_amount > data.amount) {
      return res.status(404).json({
        status: "success",
        message: "The amount is higher than payable amount, please check",
      });
    }
    const newAmount = {
      paid_amount: req.body.paid_amount + data.paid_amount,
      amount: data.amount - req.body.paid_amount,
    };
    User.findByIdAndUpdate(user_id, newAmount, (err, emp) => {
      if (err) {
        return res
          .status(500)
          .send({ error: "Problem with Updating the   Employee recored " });
      }
      res.send({ status: "success", message: "Updation successfull" });
    });
  });
}

module.exports = {
  signup,
  login,
  logout,
  getByUserId,
  addAmount,
  getAll,
  getByAmt,
  filterByDate,
  users,
  payAmount,
};
