var mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

var seeds = [
  {
    name: "Cloud's Rest",
    image:
      "https://images.pexels.com/photos/1390223/pexels-photo-1390223.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Enim diam vulputate ut pharetra sit amet aliquam id. Id interdum velit laoreet id donec. Aliquam sem et tortor consequat id porta nibh venenatis cras. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut sem viverra aliquet eget sit amet tellus cras. Vestibulum morbi blandit cursus risus at ultrices. Auctor eu augue ut lectus arcu bibendum at. Amet luctus venenatis lectus magna. Condimentum vitae sapien pellentesque habitant morbi tristique senectus et. In hendrerit gravida rutrum quisque. Ultricies mi quis hendrerit dolor magna eget est lorem ipsum. Enim eu turpis egestas pretium aenean. Nullam non nisi est sit amet. Aliquam eleifend mi in nulla posuere.",
    price: 9.0,
  },
  {
    name: "Desert mesa",
    image:
      "https://images.pexels.com/photos/1713953/pexels-photo-1713953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Dui faucibus in ornare quam viverra orci. At auctor urna nunc id. Adipiscing enim eu turpis egestas. Mattis nunc sed blandit libero. Sed blandit libero volutpat sed cras ornare arcu dui. Lectus nulla at volutpat diam ut venenatis tellus in metus. Iaculis urna id volutpat lacus laoreet non curabitur gravida. Ornare quam viverra orci sagittis eu volutpat odio facilisis. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Arcu dui vivamus arcu felis bibendum ut tristique.",
    price: 9.0,
  },
  {
    name: "Canyon Floor",
    image:
      "https://images.pexels.com/photos/3312662/pexels-photo-3312662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Sit amet nulla facilisi morbi. In hac habitasse platea dictumst vestibulum rhoncus est. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Ultricies lacus sed turpis tincidunt. A scelerisque purus semper eget duis. Bibendum enim facilisis gravida neque convallis a cras semper. Sem integer vitae justo eget magna. Nibh ipsum consequat nisl vel. Enim nunc faucibus a pellentesque. Egestas sed sed risus pretium quam vulputate. Mauris augue neque gravida in fermentum et sollicitudin ac. Cras tincidunt lobortis feugiat vivamus at. Odio eu feugiat pretium nibh ipsum. Convallis aenean et tortor at risus viverra. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Bibendum enim facilisis gravida neque convallis a cras semper. Non tellus orci ac auctor augue mauris augue neque. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Justo eget magna fermentum iaculis eu non diam phasellus vestibulum. Donec ultrices tincidunt arcu non.",
    price: 9.0,
  },
];

async function seedDB() {
  try {
    // remove all campgrounds and comments
    await Comment.remove({});
    // console.log("Comment removed!");
    await Campground.remove({});
    // console.log("Campground removed!");
    for (const seed of seeds) {
      let campground = await Campground.create(seed);
      let comment = await Comment.create({
        text: "This is a good place",
        author: "John",
        star: 2,
      });
      // console.log("Comment created!");
      campground.comments.push(comment);
      campground.save();
      // console.log("Comment added to campground!");
    }
  } catch(e) {
    console.log(e);
  }
}

module.exports = seedDB;
