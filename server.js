var express = require('express'),
    app = express(),
    fs = require('fs'), 
    browserify = require('browserify-middleware'),
    path = require('path'),
    port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    compression = require('compression'),
    mongo = require('mongodb'),
    monk = require('monk');

// default to a 'localhost' configuration:
var db_connection = '127.0.0.1:27017/event';
// if OPENSHIFT env variables are present, use the available connection info
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    db_connection = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

db = monk(db_connection);
app.use(compression());

// Provide a browserified file at a specified path

app.get('/js/app-bundle.js',browserify('./app/app.js'));

app.use(express.static(__dirname + '/app'));
app.get('/today', function(req, res) {
    collection = db.get('today');
    collection.find({}, {}, function(err, docs) {
        res.json(docs);
    })
})

app.get('/tomorrow', function(req, res) {
    collection = db.get('tomorrow');
    collection.find({}, {}, function(err, docs) {
        res.json(docs);
    })
})
//facebook redirects
app.get('/events/:name', function(req, res) {
    res.redirect('https://facebook.com/events/' + req.params.name);
})

app.get('*.akamaihd.net*', function(req, res) {
    res.redirect('cache' + path.basepath(req.params.name));
})

app.listen(port, ip, function() {
    console.log("MCJohnEvents Listening on " + ip + ", server_port " + port)
});
