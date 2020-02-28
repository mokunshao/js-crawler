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

const getMovies = async function (url) {
  const res = await fetch(url);
  const html = await res.text();
};

const main = function () {
  const url = 'https://movie.douban.com/top250';
  getMovies(url);
};

main();