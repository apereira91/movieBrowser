$(document).ready(function () {
  // Getting references to our form and input
  var searchForm = $(".api-search");
  console.log(searchForm);
  var searchInput = $(".search");
  var submitBtn = $("#search-submit");
  submitBtn.on("click", function (event) {
    event.preventDefault();
    searchTerm = searchInput.val();
    console.log(searchTerm);
    $.ajax({
      type: "GET",
      url: "/api/search/" + searchTerm,
      success: function (response) {
        console.log(response);
      },
      error: function (e) {
        console.log(e);
      }
    });
  });
});