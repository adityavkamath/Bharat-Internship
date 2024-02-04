const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/post.js');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Variables
const pages = [
    {
        name: 'Home',
        url: '/',
    },
    {
        name: 'About',
        url: '/about',
    },
];

// GET REQUESTS
app.get('/', async (request, response) => {
    try {
        const posts = await Post.find().select('displayId title content').exec();
        response.render('index.ejs', { posts, url: request.url, pages });
    } catch (error) {
        console.error('Error fetching posts:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.get('/about', (request, response) => {
    response.render('about.ejs', { url: request.url, pages });
});

// POST REQUESTS
app.post('/submit-post', async (request, response) => {
    try {
        if (request.body['post-title']) {
            const postCount = await Post.countDocuments();
            const post = new Post({
                title: request.body['post-title'],
                content: request.body['post-content'],
                displayId: postCount + 1, // Set displayId based on current count
            });

            await post.save();
        }

        response.redirect('/');
    } catch (error) {
        console.error('Error submitting post:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.post('/delete-post', async (request, response) => {
    try {
        const postIdToDelete = request.body['post-to-delete'];

        if (postIdToDelete) {
            // Find and delete the post by _id (assuming _id is the default ObjectId field in MongoDB)
            const deletedPost = await Post.findByIdAndDelete(postIdToDelete).exec();

            if (deletedPost) {
                console.log(`Post with _id ${postIdToDelete} deleted successfully.`);
            } else {
                console.log(`Post with _id ${postIdToDelete} not found.`);
            }
        }

        response.redirect('/');
    } catch (error) {
        console.error('Error deleting post:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
