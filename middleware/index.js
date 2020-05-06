var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground) {
          req.flash("error", "Campground not found");
          res.redirect("back");
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "Permission denied");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
    }
};

middlewareObj.checkCommentOwnerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function (err, comment) {
        if (err || !comment) {
          req.flash("error", "Comment not found");
          res.redirect("back");
        } else {
          if (comment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "Permission denied");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

module.exports = middlewareObj;