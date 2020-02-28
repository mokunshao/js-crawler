const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');

const Movie = function () {
  this.name = '';
  this.score = 0;
  this.quote = '';
  this.ranking = 0;
  this.coverUrl = '';
};

const getMovie = function (element) {
  const e = cheerio.load(element);
  const name = e('.title').text();
  const score = e('.rating_num').text();
  const quote = e('.inq').text();
  const ranking = parseInt(e('.pic em').text());
  const coverUrl = e('img').attr('src');
  const movie = new Movie();
  movie.score = score;
  movie.name = name;
  movie.quote = quote;
  movie.ranking = ranking;
  movie.coverUrl = coverUrl;
  return movie;
};

const getMovies = async function (url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const movies = [];
  const moviesDiv = $('.item');
  moviesDiv.each(function (i, item) {
    const movie = getMovie(item);
    movies.push(movie);
  });
  console.log(movies);
};

const main = function () {
  const url = 'https://movie.douban.com/top250';
  getMovies(url);
};

main();