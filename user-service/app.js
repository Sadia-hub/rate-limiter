// user-service.js
const express = require('express');

const app = express();
app.use(express.json());


app.get('/gift', (req, res) => {
    const gift = { id: Date.now(), item:"Nisan Car Latest Model" };
    res.status(201).json({ message: 'User won', gift });
});

// Server listens on port 3001
app.listen(3001, () => {
    console.log('User Service is running on port 3001');
});
