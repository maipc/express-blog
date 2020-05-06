var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function (err, campground) {
    if (!err) {
      res.render("comments/new", { campground: campground });
    }
  });
});

// create
router.post("/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function (err, campground) {
    if (!err) {
      Comment.create(req.body.comment, function (err, comment) {
        if(err) {
          req.flash("error", 'Something went wrong...');
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "You create a comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// edit
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, (req, res) => {
  Campground.findById(req.params.id, function(err, campground) {
    if(err || !campground) {
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      Comment.findById(req.params.comment_id, function (err, comment) {
        if (err) {
          res.redirect("back");
        } else {
          res.render("comments/edit", {
            campground_id: req.params.id,
            comment: comment,
          });
        }
      });
    }
  });
});

// update 
router.put("/:comment_id", middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//delete
router.delete("/:comment_id", middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function (err, comment) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment is removed");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
