const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground.js");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", (req, res) => {
    Campground.create(req.body.campground, function(err, campground) {
        if(err) {
            res.redirect("/campgrounds/new");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.render("show", {campground: campground});
        }
    });
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
