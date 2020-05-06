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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// create
router.post("/", isLoggedIn, (req, res) => {
  Campground.create(req.body.campground, function (err, campground) {
    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    campground.author = author;
    campground.save();
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

// edit
router.get("/:id/edit", checkCampgroundOwnerShip, (req, res) => {
  Campground.findById(req.params.id, function (err, campground) {
    res.render("campgrounds/edit", { campground: campground });
  });
});

// update
router.put("/:id", checkCampgroundOwnerShip, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    campground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});

// delete
router.delete("/:id", checkCampgroundOwnerShip, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, function (
    err,
    removedCampground
  ) {
    if (err) {
      console.log(err);
    }
    Comment.deleteMany({ _id: { $in: removedCampground.comments } }, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/campgrounds");
    });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnerShip(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, campground) {
      if (err) {
        res.redirect("back");
      } else {
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
