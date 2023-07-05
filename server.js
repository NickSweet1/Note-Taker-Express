const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;

app.use(express.static('public'))

app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/api/notes', (req, res) => {

    const data =JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')))
    console.log(data)
    res.json(data)
    

})

app.post('/api/notes', (req, res) => {
    const currentNotes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    }
    
    currentNotes.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(currentNotes));
    res.json(newNote);
})

app.delete('/api/notes/:id', (req, res) => {
    const currentNotes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    const updatedNotes = currentNotes.filter(note => note.id !== req.params.id)

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(updatedNotes));
    res.json({message:"delete success"});
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})