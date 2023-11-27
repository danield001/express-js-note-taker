const express = require('express');
const savedNotes = require('./db/db.json');
const path = require('path');
const fs = require('fs').promises; // Use fs.promises for asynchronous operations
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.post('/notes', async (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };

        // Update the db.json file
        savedNotes.push(newNote);

        try {
            await fs.writeFile('./db/db.json', JSON.stringify(savedNotes));
            const response = {
                status: 'success',
                body: newNote,
            };

            console.log(response);
            res.status(201).json(response);
        } catch (error) {
            console.error('Error writing to db.json:', error);
            res.status(500).json('Error compiling note');
        }
    } else {
        res.status(500).json('Error compiling note');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
