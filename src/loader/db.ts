import mongoose from "mongoose";
import config from "../config";
import User from "../models/User"
import Cafeti from "../models/Cafeti";
import Category from "../models/Category";
import Cafe from "../models/Cafe";
import Review from "../models/Review";
import Tag from "../models/Tag";
import Menu from "../models/Menu";
import Report from "../models/Report";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("Mongoose Connected ...");

    User.createCollection().then(function(collection){
      console.log("User Collection is created!");
    });

    Cafeti.createCollection().then(function(collection){
      console.log("Cafeti Collection is created!");
    });

    Category.createCollection().then(function(collection){
      console.log("Category Collection is created!");
    });
    
    Cafe.createCollection().then(function(collection){
      console.log("Cafe Collection is created!");
    });

    Review.createCollection().then(function(collection){
      console.log("Review Collection is created!");
    });

    Tag.createCollection().then(function(collection){
      console.log("Tag Collection is created!");
    });
    Menu.createCollection().then(function(collection){
      console.log("Menu Collection is created!");
    });
    Report.createCollection().then(function(collection){
      console.log("Report Collections is created!");
    });

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;