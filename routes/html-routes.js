// Requiring path to so we can use relative routes to our HTML files
// var path = require("path");
var handlebars = require("express-handlebars");
// const express = require("express");
// const app = express();
var axios = require("axios");  


// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  app.engine("handlebars", handlebars({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");

  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));

    // this needs to be the request that was indicated by the user, but the results from any of those
    // can be passed as shown to the res.render 

    var trending = 'https://api.themoviedb.org/3/trending/movie/week?api_key=2649499bd7881ccde384a74d51def54b';
    axios.get(trending).then(response => {
      // this is the code if we filter by genre 
      // var selectedMovies = response.data.results.filter( movie => {
      //     for (let i=0; i < genreFilter.length; i++) {
      //         // check each genre chosen to see if it matches this movie
      //        if (movie.genre_ids.indexOf(genreFilter[i]) != -1 ) return true;     
      //     }
      //     return false;  
      // })
      var movies = response.data;
      console.log(movies);
      res.render("index", movies);
    });
  });

  app.get("/sign-up", function (req, res) {
    res.render("sign-up");
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function (req, res) {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    res.render("members");
  });

};
