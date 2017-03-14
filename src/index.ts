let express = require('express');
let app = express();

let UserDao = require('./model/User');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/users', function (req, res) {
    UserDao.fetchAll().then(function(users) {
        console.log(JSON.stringify(users));
        res.send(users);
    }).catch(function(err) {
        console.error(err);
        res.status(500).send('An error happened!');
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
