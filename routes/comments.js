var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

// new
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function (err, campground) {
    if (!err) {
      res.render("comments/new", { campground: campground });
    }
  });
});

// create
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

// edit
router.get("/:comment_id/edit", checkCommentOwnerShip, (req, res) => {
  Comment.findById(req.params.comment_id, function(err, comment) {
    if(err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: comment});
    }
  });
});

// update 
router.put("/:comment_id", checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//delete
router.delete("/:comment_id", checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function (err, comment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCommentOwnerShip(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, comment) {
      if (err) {
        res.redirect("back");
      } else {
        if (comment.author.id.equals(req.user._id)) {
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
