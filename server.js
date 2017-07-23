var path = require('path');
var fs = require('fs');
var express = require('express');
var util = require('util');
var say = require('say');
var app = express();
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(5000);
console.log('Server listening on port 5000');

var io = require('socket.io')(server);

var sendComments = function (socket) {
    fs.readFile('_comments.json', 'utf8', function(err, comments) {
        comments = JSON.parse(comments);
        socket.emit('comments', comments);
    });
};

io.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log('New client connected from '+ address);
    socket.on('fetchComments', function () {
        sendComments(socket);
    });

    socket.on('newComment', function (comment, callback) {
        fs.readFile('_comments.json', 'utf8', function(err, comments) {
            comments = JSON.parse(comments);
            comments.push(comment);
	    commentAuthor = (comment.author);
            commentBody = (comment.text);
	    say.speak(commentAuthor + " says " + commentBody);
            fs.writeFile('_comments.json', JSON.stringify(comments, null, 4), function (err) {
                io.emit('comments', comments);
                callback(err);
            });
        });
    });
});
