const express = require("express");
var router = express();
const bodyparser = require("body-parser");
router.use(bodyparser.json());
const auth = require("../middleware/user.middleware");
const adm = require("../middleware/admin.middleware");

const user = require("../controller/user.controller");
const meals = require("../controller/meals.controller");
const admin = require("../controller/admin.controller");

router.get("/", (req, res) => {
  res.send("hello");
});
router.post("/signup", user.signup);
router.post("/login/", user.login);
router.post("/logout", auth.accessToken, user.logout);
router.get("/profile", auth.accessToken, user.getByUserId);

router.post("/meals", meals.create);
router.get("/meals", meals.view);
router.get("/meals/:id", meals.getById);
router.put("/amount", auth.accessToken, user.addAmount);

router.get("/all", auth.accessToken, user.getAll);
router.get("/am", auth.accessToken, user.getByAmt);
router.post("/filter", auth.accessToken, user.filterByDate);

router.post("/create_admin", admin.createAdmin);
router.post("/ad_login", admin.AdminLogin);

router.post("/adminLogout", adm.adminToken, admin.adminLogout);
router.get("/users/", user.users);

router.get("/test/", meals.test);

module.exports = router;
