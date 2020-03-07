// Requiring path to so we can use relative routes to our HTML files
// var path = require("path");
const db = require("../models");
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
const isAuthenticated = require("../config/middleware/isAuthenticated");

var genreListArray = [];
var genreIndex = [];

var getGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}`;
axios.get(getGenres).then(response => {
  genreIndex = response.data.genres;
});

function pictureSource(picture) {
  if (picture !== null) {
    return "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + picture;
  } else {
    return "/assets/default.png";
  }
}


function processList(movies, req) {
  console.log("number of movies returned: ", movies.results.length);
  for (var i = 0; i < movies.results.length; i++) {
    genreListArray = [];
    movies.results[i].genre_ids.forEach(mgid => {
      var i = lodash.findIndex(genreIndex, g => {
        return g.id === mgid;
      });
      genreListArray.push(genreIndex[i].name);
    });
    movies.results[i].genreList = genreListArray.join(", ");
    movies.results[i].backdrop_path = pictureSource(movies.results[i].backdrop_path);
    movies.results[i].poster_path = pictureSource(movies.results[i].poster_path);
  }
  if (movies.results.length === 0) {
    movies.page_message = "No entries found.";
  } else {
    movies.page_message = "";
  }
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



  app.get("/watchlist", isAuthenticated, (req, res) => {

    var query = { "UserId": req.user.id };
    var watchList = [];

    // replace with code to get watchlist data
    db.Movie.findAll({
      where: query
    }).then(function (results) {
      console.log("Results: ", results);
      results.forEach(m => {
        console.log(m.dataValues.movieId);
        watchList.push(m.dataValues.movieId);
      });
      console.log("Watchlist array: ", watchList);

      var movieList = [];
      var promiseArray = [];
      for (let i = 0; i < watchList.length; i++) {
        var getMovie = `https://api.themoviedb.org/3/movie/${watchList[i]}?api_key=2649499bd7881ccde384a74d51def54b`;
        promiseArray.push(axios.get(getMovie));
      }
      Promise.all(promiseArray).then(function (values) {
        // loop for each movie
        for (let i = 0; i < values.length; i++) {
          genreListArray = [];
          console.log(values[i].data.genres);
          values[i].data.genres.forEach(g => {
            genreListArray.push(g.name);
          });
          values[i].data.genreList = genreListArray.join(", ");
          movieList.push(values[i].data);

          // fill in full path to pictures, use default picture if none provided
          values[i].data.backdrop_path = pictureSource(values[i].data.backdrop_path);
          values[i].data.poster_path = pictureSource(values[i].data.poster_path);
          values[i].data.inWatchlist = true;
        }
        console.log(movieList);
        console.log("watchlist generated:", movieList);
        var isLoggedIn = (req.user !== undefined);
        var pageParams = { results: movieList, isAuthenticated: isLoggedIn };
        if (watchList.length === 0) {
          pageParams.page_message = "No entries found.";
        } else {
          pageParams.page_message = "";
        }
        console.log(pageParams);
        res.render("index", pageParams);
      });
    });

  });

};
