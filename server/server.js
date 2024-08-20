const express = require('express');
const path = require('path');

const app = express();

// Define the path to the Angular app's build directory
const clientDistPath = path.join(__dirname, '../client/dist/client');

// Serve the static files from the Angular app
app.use(express.static(clientDistPath));

// Handle all other routes by serving the Angular app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Set the port to listen on
const port = process.env.PORT || 3010;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
