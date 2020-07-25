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

const saveMovies = function (movies, dirname) {
  const path = 'douban.txt';
  const path2 = !dirname ? path : `./${dirname}/${path}`;
  const data = JSON.stringify(movies, null, 2);
  fs.writeFile(path2, data, function (error) {
    if (error === null) {
      console.log(path + ' 保存成功！');
    } else {
      console.log(error);
    }
  });
};

const downloadMoviesCover = function (movies, dirname) {
  movies.forEach(function (movie) {
    const path = movie.name.split('/')[0].trim() + '.jpg';
    const path2 = !dirname ? path : `./${dirname}/${path}`;
    const coverUrl = movie.coverUrl;
    fetch(coverUrl)
      .then((res) => res.buffer())
      .then((data) => {
        const writerStream = fs.createWriteStream(path2);
        writerStream.write(data, 'UTF8');
        writerStream.end();
      });
  });
};

const createDirectory = function (dirname) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
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
  createDirectory('storage');
  saveMovies(movies, 'storage');
  downloadMoviesCover(movies, 'storage');
};

const main = function () {
  const url = 'https://movie.douban.com/top250';
  getMovies(url);
};

main();
