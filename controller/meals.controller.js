const Meals = require("../models/meals.models");
const Test = require("../models/test.models");

function ml(req, res, next) {
  console.log("value", req);
  let name = req.body.name;
  let date = req.body.date;
  let address = req.body.address;
  let test = new Test({
    name,
    date,
    address,
  });
  test.save().then((data) => {
    res.send(data);
  });
}

function mlm(req, res, next) {
  Test.find({}).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function create(req, res, next) {
  let name = req.body.name;
  let rate = req.body.rate;

  let meals = new Meals({
    name,
    rate,
  });
  meals.save().then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function view(req, res, next) {
  Meals.find({}).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function test(req, res, next) {
  res.status(200).json({ status: "success", data: "hello" });
}

function getById(req, res) {
  Meals.findById(req.params.id).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

module.exports = { create, view, getById, test, ml, mlm };
