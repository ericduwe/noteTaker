const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const PORT = 3001;
const notes = require('./db/db.json');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));



app.post('/api/notes', (req, res) => {
    //Log our request to the terminal
    console.info(`${req.method} request received to add a new note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
        };

    readAndAppend(newNote, './db/db.json');

    const response = {
        status: 'success',
        body: newNote
    };

    console.log(response);
    res.status(201).json(response);
    } else {
        res.status(500).json('Error in creating note')
    }
});

app.get('/api/notes', (req, res) => {
    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.get('/notes', (req, res) => {
 // Sending notes.html to the client
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

app.get('*', (req, res) => {
 // Sending index.html to the client
    res.sendFile(path.join(__dirname, '/public/index.html'))
  });





  app.listen(PORT, () =>
  console.info(`Example app lisening at http://localhost:${PORT} 🚀`)
)