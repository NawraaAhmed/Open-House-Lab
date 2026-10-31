// imports
const express = require("express"); //importing express package
const app = express(); // creates a express application
const dotenv = require("dotenv").config(); //this allows me to use my .env values in this file
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const User = require("./models/User");
const Listing = require("./models/Listing");
const Review = require("./models/Review");
const Category = require("./models/Category");

// Middleware
app.use(express.static("public")); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride("_method"));
app.use(morgan("dev"));

async function conntectToDB() {
  //connection to the database
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error Occured", error);
  }
}

conntectToDB();

// Routes go here
async function testRelationships() {
  /*  const newUser = await User.create({
    username: "nawraa",
    password: "123456",
  }); */

  /* const newListing = await Listing.create({
    streetAddress: "Road 123",
    city: "Manama",
    price: 500,
    size: 120,
    owner: newUser._id,
  });
 */
  const allListings = await Listing.find().populate("owner");
  /*
  .populate({
  path: 'owner',
  select: 'username'
  })
  */
  console.log(allListings);
}
testRelationships();

app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

app.get("/categories/new", (req, res) => {
  res.render("categories/create-category.ejs");
});

app.post("/categories", async (req, res) => {
  try {
    const categoryName = req.body;

    await Category.create({
      categoryName: categoryName,
    });

    res.redirect("/categories");
  } catch (error) {
    console.log(error);
  }
});

app.get("/categories", async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.render("categories/all-categories.ejs", { categories: allCategories });
  } catch (error) {
    console.log(error);
  }
});

app.get("/listings/new", async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.render("listings/create-listing.ejs", { categories: allCategories });
  } catch (error) {
    console.log(error);
  }
});

app.post("/listings", async (req, res) => {
  try {
    const { streetAddress, city, price, size, category } = req.body;

    await Listing.create({
      streetAddress: streetAddress,
      city: city,
      price: price,
      size: size,
      category: category,
    });

    res.redirect("/listings");
  } catch (error) {
    console.log(error);
  }
});

app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find().populate("category");
    res.render("listings/all-listings.ejs", { listings: allListings });
  } catch (error) {
    console.log(error);
  }
});

app.get("/listings/:listingId/edit", async (req, res) => {
  try {
    const foundListing = await Listing.findById(req.params.listingId);
    const allCategories = await Category.find();
    res.render("listings/edit-listing.ejs", {
      listing: foundListing,
      categories: allCategories,
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/listings/:listingId", async (req, res) => {
  try {
    const { streetAddress, city, price, size, category } = req.body;

    await Listing.findByIdAndUpdate(req.params.listingId, {
      streetAddress: streetAddress,
      city: city,
      price: price,
      size: size,
      category: category,
    });

    res.redirect("/listings");
  } catch (error) {
    console.log(error);
  }
});

app.delete("/listings/:listingId", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.listingId);
    res.redirect("/listings");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Listening on port " + 3000);
}); // Listen on port 3000
