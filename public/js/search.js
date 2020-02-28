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
    $.ajax("/api/search/" + searchTerm, {
      type: "GET"
    });
  });
});