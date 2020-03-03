// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var axios = require("axios");
var lodash = require("lodash");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

var getGenres = "https://api.themoviedb.org/3/genre/movie/list?api_key=2649499bd7881ccde384a74d51def54b";
var genreIndex = [];
axios.get(getGenres).then(response => genreIndex = response.data.genres);
var genreListArray = [];

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/:id", function (req, res) {
    console.log(req.params);
    var getMovie = "https://api.themoviedb.org/3/movie/" + req.params.id + "?api_key=2649499bd7881ccde384a74d51def54b";
    console.log(getMovie);
    axios.get(getMovie).then(function (response) {
      let movie = response.data;
      console.log(movie);
      genreListArray = [];
      movie.genres.forEach(g => {
        genreListArray.push(g.name);
      });
      movie.genreList = genreListArray.join(", ");
      // fill in full path to pictures, use default picture if none provided
      if (movie.backdrop_path !== null) {
        movie.backdrop_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movie.backdrop_path;
      } else {
        movie.backdrop_path = "http://localhost:8080/assets/default.png";
      }

      if (movie.poster_path !== null) {
        movie.poster_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movie.poster_path;
      } else {
        movie.poster_path = "http://localhost:8080/assets/default.png";
      }
      movie.isAuthenticated = (req.user !== undefined);
      res.render("info", movie);
    })
      .catch(function (err) {
        console.log(err);
      });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //Route for getting some data in the search bar
  app.get("/api/search/:searchstring", function (req, res) {
    // console.log(req.params);
    var searchTerm = req.params.searchstring.replace(" ", "+");
    var searchMovie = "https://api.themoviedb.org/3/search/movie?api_key=2649499bd7881ccde384a74d51def54b&query=" + searchTerm;
    // console.log(searchMovie);
    axios.get(searchMovie).then(function (response) {
      let movies = response.data;
      // console.log(movies);
      // need to do the genre merging
      genreListArray = [];
      for (let i = 0; i < movies.results.length; i++) {
        genreListArray = [];
        movies.results[i].genre_ids.forEach(mgid => {
          var i = lodash.findIndex(genreIndex, g => {
            return g.id === mgid;
          });
          genreListArray.push(genreIndex[i].name);
        });
        movies.results[i].genreList = genreListArray.join(", ");

        // fill in full path to pictures, use default picture if none provided

        if (movies.results[i].backdrop_path !== null) {
          movies.results[i].backdrop_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movies.results[i].backdrop_path;
        } else {
          movies.results[i].backdrop_path = "http://localhost:8080/assets/default.png";
        }

        if (movies.results[i].poster_path !== null) {
          movies.results[i].poster_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + movies.results[i].poster_path;
        } else {
          movies.results[i].poster_path = "http://localhost:8080/assets/default.png";
        }
      }
      movies.searchstring = req.params.searchstring;
      movies.isAuthenticated = (req.user !== undefined);
      if (movies.results.length === 0) {
        movies.page_message = "No entries found.";
      } else {
        movies.page_message = "";
      }
      res.render("search", movies);
    })
      .catch(function (err) {
        console.log(err);
      });

  });

  app.post("/api/addwatchlist", isAuthenticated, function (req, res) {
    console.log("post /api/addwatchlist ", req.body.movieId, req.user.id);
    db.Movie.create({
      movieId: req.body.movieId,
      UserId: req.user.id
    }).then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
      res.status(401).json(err);
    });
  });

  app.delete("/api/deletewatchlist/:movieId", function (req, res) {
    //console.log(req.params.id);
    // res.json(req.params.id);
    console.log("DELETE /api/deletewatchlist/:movieId: ", req.params.movieId, " ");
    console.log("user: ",req.user);
    db.Movie.destroy({
      where: {
        movieId: req.params.movieId,
        UserId: req.user.id
      }
    }).then(function (msg) {
      console.log("After delete: ", msg); 
    });
  });
};
