const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground.js"),
  Comment = require("./models/comment.js"),
  seedDB = require("./seeds.js");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
});
seedDB();

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res) => {
  Campground.create(req.body.campground, function (err, campground) {
    if (err) {
      res.redirect("/campgrounds/new");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        // console.log(campground);
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, function(err, campground) {
    if(!err) {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, function(err, campground) {
    if(!err) {
      Comment.create(req.body.comment, function(err, comment) {
        if(!err) {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
