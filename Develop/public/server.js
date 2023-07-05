const fs = require('fs');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;

app.use(express.static('public'))

app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/notes.html');
});


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error"});
            return;
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    })
})

app.post('/api/notes', (req, res) => {
    const currentNotes = JSON.parse(fs.readFileSync('../db/db.json', 'utf8'));
    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    }
    
    currentNotes.push(newNote);
    fs.writeFileSync('../db/db.json', JSON.stringify(currentNotes));
    res.json(newNote);
})

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})