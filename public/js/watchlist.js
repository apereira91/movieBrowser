$(document).ready(function () {
  //var addToWatchlist = $("data-movieid");
  var addButton = $(".add-watchlist-btn");
  var removeButton = $(".remove-watchlist-btn");

  addButton.on("click", function (event) {
    //console.log($(this));
    event.preventDefault();
    let movieId = $(this).attr("data-movieid");
    // let movieName = $(this).parent().parent().children(".card-content").children().children().text();
    console.log(movieId);
    // if not logged in, pop up a modal to make them log in

    movieId && addMovieData(movieId);
    !movieId && alert("No Movie");
  });

  function addMovieData(movieId) {
    $.post("/api/addwatchlist", {
      movieId: movieId
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
    movieId && removeMovieData(movieId);
    !movieId && alert("No Movie");
  });

  function removeMovieData(movieId) {
    $.ajax({
      method: "DELETE",
      url: "/api/deletewatchlist/" + movieId
    }).then(function () {
      window.location.href("/watchlist");  
    });
  }
});
