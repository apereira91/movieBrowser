// var apiKey = "2649499bd7881ccde384a74d51def54b"; 

// var url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`;
// var trending = 'https://api.themoviedb.org/3/trending/movie/week?api_key=2649499bd7881ccde384a74d51def54b';  
// var nowPlaying = 'https://api.themoviedb.org/3/movie/now_playing?api_key=2649499bd7881ccde384a74d51def54b':
// // only gets a couple of movies by that actor 
// var byActor = 'https://api.themoviedb.org/3/find/nm0185819?api_key=2649499bd7881ccde384a74d51def54b&language=en-US&external_source=imdb_id';
// var byTitle = 'https://api.themoviedb.org/3/find/tt8946378?api_key=2649499bd7881ccde384a74d51def54b&language=en-US&external_source=imdb_id'; 

const axios = require("axios");  

var getGenres = 'https://api.themoviedb.org/3/genre/movie/list?api_key=2649499bd7881ccde384a74d51def54b';  

axios.get(getGenres).then(response => { 
    console.log(response.data.genres); 
}); 
