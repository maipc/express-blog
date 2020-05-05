var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");

// index
router.get("/", (req, res) => {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});

// new
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// create
router.post("/", (req, res) => {
  Campground.create(req.body.campground, function (err, campground) {
    if (err) {
      res.redirect("/campgrounds/new");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// show
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, campground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        // console.log(campground);
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

module.exports = router;
