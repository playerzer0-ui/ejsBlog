import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const blogPosts = JSON.parse(readFileSync('blog.json', 'utf8'));

app.get('/', (req, res) => {
    res.render('index.ejs', { posts: blogPosts });
});

app.get('/create', (req, res) => {
    res.render('creation.ejs');
});

app.post('/create', (req, res) => {
    let title = req.body.title;
    let date = new Date().toISOString().split('T')[0];
    let bodyText = req.body.bodyText;
    let id = uuidv4();

    blogPosts[id] = { title, date, body: bodyText };
    writeFileSync('blog.json', JSON.stringify(blogPosts, null, 2));
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    let post = blogPosts[id];

    res.render('creation.ejs', { id: id, post: post });
});

app.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let title = req.body.title;
    let bodyText = req.body.bodyText;
    let date = new Date().toISOString().split('T')[0];
    blogPosts[id] = { title, date, body: bodyText };
    writeFileSync('blog.json', JSON.stringify(blogPosts, null, 2));
    res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    delete blogPosts[id];
    writeFileSync('blog.json', JSON.stringify(blogPosts, null, 2));
    res.redirect('/');
});

app.get('/post/:id', (req, res) => {
    let id = req.params.id;
    let post = blogPosts[id];
    res.render('post.ejs', { post: post });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});