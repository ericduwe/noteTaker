const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const PORT = 3001;
const notes = require('./db/db.json');
const uuid = require('./helpers/uuid');
const fs = require('fs');

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

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote)

            fs.writeFile('./db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr ? console.error(writeErr) : console.info("Successfully updated notes")
            );
        }
    })

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

app.get('/notes', (req, res) => {
 // Sending notes.html to the client
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

app.get('*', (req, res) => {
 // Sending index.html to the client
    res.sendFile(path.join(__dirname, '/public/index.html'))
  });

app.get('/api/notes', (req, res) => {
    // Log our request to the terminal
    res.status(200).json(`${req.method} request received to get notes`)
    console.info(`${req.method} request received to get notes`)
});



  app.listen(PORT, () =>
  console.info(`Example app lisening at http://localhost:${PORT} 🚀`)
)