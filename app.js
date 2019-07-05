const http = require('http'),
    parser = require('body-parser');
var express = require('express'),
    app = express(),
    portApi = process.env.port || 80,
    fs = require('fs'),
    username, password;
app.use(parser.urlencoded({
    extended: true
}));




app.use(parser.json());
app.listen(portApi);

// getCredential();
app.post('/read', (req, res) => {
    console.log(req.body);
    var inputUsername = req.body.username;
    var inputPassword = req.body.password;
    var storedUsername = fs.readFileSync('store.txt');
});

app.post('/', (req, res) => {
    console.log(req.headers.authorization);
    res.status(200).send('abc');
});
app.get('/', (req, res) => {
    // console.log(req);
    // res.send("avc");
    getCredential();
    console.log(JSON.stringify(req.headers.authorization));
    var date = new Date();
    res.status(200).json({
        "username": username,
        "password": password,
        "day": date.getDate(),
        "hr": date.getUTCHours(),
        "yr": date.getFullYear(),
        'fdate': date.getTime()

    });
    // res.send(getCredential());
});

function getCredential() {
    var data = fs.readFileSync('store.json');
    let cred = JSON.parse(data);
    username = cred.username;
    password = cred.password;
}


app.post('/auth/jwt', (req, res) => {
    console.log(req.body);
    var inputUsername = req.body.username;
    var inputPassword = req.body.password;
    getCredential();
    if (inputUsername.trim() == username && inputPassword.trim() == password) {
        var date = new Date();
        res.status(200).json({
            "tokem": "timeStamp_" + date.getTime()
        });
    }
});

app.post('/auth/test/jwt', (req, res) => {
    var auth = req.headers.authorization.split(" ");
    if (auth[0] == "Bearer") {
        var token = auth[1].split("_");
        var timeStamp = new Date().getTime();
        // token expire after 5'
        if (Number(token[1]) + 5 * 60 < timeStamp) {
            res.status(200).json({
                "result": "success"
            });
        } else {
            res.status(201).json({
                "result": "Failed authentication"
            });
        }
    }
});


app.get('/auth/basic', (req, res) => {
    getCredential();
    var auth = req.headers.authorization.split(" ");
    if (auth[0] == "Basic") {
        let buff = new Buffer(auth[1], 'base64');
        let decodedAuth = buff.toString('ascii');
        if (decodedAuth == (username + ":" + password)) {
            res.status(200).json({
                "result": "success"
            });
        } else {
            res.status(201).json({
                "result": "Failed Authentication"
            });
        }
    }
});