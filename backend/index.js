import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
const app = express();


app.use(express.json()); // Add middleware to parse JSON

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).json('Hello World');
}); // Add a route to the app

app.post('/books', async (req, res) => {
    try{
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ) {
            return res.status(400).json({message: 'Please fill in all fields'});
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear
        };
        const book = await Book.create(newBook);
        return res.status(200).json(book); 

    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message});
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        return res.status(200).json({
            count: books.length,
            data: books
        });

    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message});
    }
});

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }); 
    })
    .catch((err) => {
        console.error(err);
    });