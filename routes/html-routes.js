// Requiring path to so we can use relative routes to our HTML files
// var path = require("path");
const handlebars = require("express-handlebars");
// const express = require("express");
// const app = express();
const axios = require("axios");
const lodash = require("lodash");

var apikey = "2649499bd7881ccde384a74d51def54b";
// var getTrending = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apikey}`;
var getUpcoming = `https://api.themoviedb.org/3/movie/upcoming/?api_key=${apikey}`;
var getPopular = `https://api.themoviedb.org/3/movie/popular/?api_key=${apikey}`;
var getTopRated = `https://api.themoviedb.org/3/movie/top_rated/?api_key=${apikey}`;
var getPlaying = `https://api.themoviedb.org/3/movie/now_playing/?api_key=${apikey}`;

// Requiring our custom middleware for checking if a user is logged in

// const isAuthenticated = require("../config/middleware/isAuthenticated");
// var isAuthenticated = require("../config/middleware/isAuthenticated");

var genreListArray = [];
var genreIndex = [];

var getGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}`;
axios.get(getGenres).then(response => {
  genreIndex = response.data.genres;
  console.log(genreIndex);
});

function processList(movies, req) {
  console.log("number of movies returned: ", movies.results.length);
  for (var i = 0; i < movies.results.length; i++) {
    console.log(movies.results[i].title, movies.results[i].genre_ids.length);
    genreListArray = [];
    movies.results[i].genre_ids.forEach(mgid => {
      var i = lodash.findIndex(genreIndex, g => {
        return g.id === mgid;
      });
      console.log("In movie: " + mgid + "   In genreIndexArray: " + genreIndex[i].name);
      genreListArray.push(genreIndex[i].name);
    });
    movies.results[i].genreList = genreListArray.join(", ");
    console.log("movie.genreList: " + movies.results[i].genreList);
  }
  console.log("req.user", req.user);
  movies.isAuthenticated = (req.user !== undefined);
  return movies;
}

module.exports = function (app) {

  app.engine("handlebars", handlebars({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");

  app.get(["/", "/popular", "/members"], (req, res) => {
    // If the user already has an account send them to the members page
    // if (req.user) {
    //   res.redirect("/members");
    // }
    axios.get(getPopular).then(response => {
      var movies = response.data;
      var movieList = processList(movies, req);
      res.render("index", movieList);
    })
      .catch(err => console.log(err));
  });

  app.get("/sign-up", (req, res) => {
    res.render("sign-up");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      // res.redirect("/", {isAuthenticated: true});
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page

  // app.get("/members", isAuthenticated, (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/members.html"));
  app.get("/members", (req, res) => {

    res.render("index");
  });

  app.get("/playing", (req, res) => {
    axios.get(getPlaying).then(function (response) {
      var movies = response.data;
      var movieList = processList(movies, req);
      res.render("index", movieList);
    });
  });

  app.get("/upcoming", (req, res) => {
    axios.get(getUpcoming).then(function (response) {
      var movies = response.data;
      var movieList = processList(movies, req);
      res.render("index", movieList);
    });
  });


  app.get("/toprated", (req, res) => {
    axios.get(getTopRated).then(response => {
      var movies = response.data;
      var movieList = processList(movies, req);
      res.render("index", movieList);
    });
  });

  app.get("/watchlist", (req, res) => {
    if (req.user) {
      res.redirect("/login", { isAuthenticated: true });
    }
    console.log("watchlist requested for user", req.user);
    // axios.get("/api/:userid").then( response => {
    //   // this api does not yet exist
    //   var movies = response.data;
    //   console.log(movies);
    //   res.render("index", movies);
    // });
  });

};
