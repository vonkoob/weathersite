const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Add list of allowed origins
const corsOptions = {
  origin: '*'
}


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("express"));
// default URL for website
app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/express/index.html'));
    //__dirname : It will resolve to your project folder.
  });
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);