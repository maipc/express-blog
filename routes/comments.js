var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function (err, campground) {
    if (!err) {
      res.render("comments/new", { campground: campground });
    }
  });
});

router.post("/", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function (err, campground) {
    if (!err) {
      Comment.create(req.body.comment, function (err, comment) {
        if (!err) {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
