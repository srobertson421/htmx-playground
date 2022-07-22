const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const showdown = require('showdown');

const markdownConverter = new showdown.Converter();
const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', { useLayout: !req.headers['hx-request'] });
});

app.get('/about', (req, res) => {
  res.render('about', { useLayout: !req.headers['hx-request'] });
});

app.get('/contact', (req, res) => {
  res.render('contact', { useLayout: !req.headers['hx-request'] });
});

app.get('/blog', (req, res) => {
  const postsList = fs.readdirSync(path.join(__dirname, 'posts'));
  res.render('blog', { useLayout: !req.headers['hx-request'], posts: postsList });
});

app.get('/blog/:slug', (req, res) => {
  const postContent = fs.readFileSync(path.join(__dirname, `posts/${req.params.slug}.md`), 'utf8');

  res.render('blog-post', {
    useLayout: !req.headers['hx-request'],
    post: markdownConverter.makeHtml(postContent)
  });
});

app.get('/*', (req, res) => {
  res.render('404', { useLayout: !req.headers['hx-request'] });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});