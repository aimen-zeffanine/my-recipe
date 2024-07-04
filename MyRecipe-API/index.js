const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));
app.use(bodyParser.json({limit: '50mb', extended:true}));
app.use('/images', express.static('images'));

const dbConfig = {url: 'mongodb://localhost:27017/MyRecipe'};
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {useNewUrlParser: true})
.then(() => {
    console.log('Successfully connected to the database');
}).catch(error => {
    console.log('Could not connect to the database', error);
    process.exit();
})

const port = process.env.port || 10000;


app.get('/', (req,res) => {
    console.log('request recieved');
    res.send('hello');
});

require('./routs/userRouts')(app);
require('./routs/postRouts')(app);


app.listen(port, () => {
    console.log(`server is up, listening on port ${port}`);
});