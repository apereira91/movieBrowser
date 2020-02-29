$(document).ready(function () {
  let lastSlash = window.location.href.lastIndexOf("/");
  let tab = "";
  switch (lastSlash) {
  case -1, 0:
    tab = "populartab"; break;
  default:
    tab = window.location.href.substr(lastSlash + 1);
    switch (tab) {
    case "":
    case "popular": tab = "populartab"; break;
    case "upcoming": tab = "upcomingtab"; break;
    case "playing": tab = "playingtab"; break;
    case "toprated": tab = "ratedtab"; break;
    case "watchlist": tab = "watchlisttab"; break;
    default: break;
    }
    $("#" + tab).addClass("active");
  }
});