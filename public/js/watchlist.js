$(document).ready(function () {
  //var addToWatchlist = $("data-movieid");
  var addButton = $(".add-watchlist-btn");
  var removeButton = $(".remove-watchlist-btn");

  addButton.on("click", function (event) {
    //console.log($(this));
    event.preventDefault();
    let movieId = $(this).attr("data-movieid");
    let movieName = $(this).parent().parent().children(".card-content").children().children().text();
    console.log(movieName);
    console.log(movieId);
    movieId && addMovieData(movieId, movieName);
    !movieId && alert("No Movie");
  });

  function addMovieData(id, name) {
    $.post("/api/", {
      id: id,
      title: name
    })
      .then(function () {
        window.location.replace("/", { isAuthenticated: true });
      })
      .catch(handleErr);
  }

  function handleErr(err) {
    $("#alert.msg").text(err.responseJSON);
    $("alert").fadeIn(500);
  }

  function getMovie() {
    $.get("/api/:id", function (data) {
      id = data;
      return id;
    });
  }
  removeButton.on("click", function (event) {
    event.preventDefault();
    let movieId = $(this).attr("data-movieid");
    let movieName = $(this).parent().parent().children(".card-content").children().children().text();
    movieId && addMovieData(movieId, movieName);
    removeMovieData(id, name);
  });
  function removeMovieData(id, name) {
    $.ajax({
      method: "DELETE",
      url: "/api/movie/" + movieid
    }).then(function () {
      getMovie(id, name);
    });
  }
});
