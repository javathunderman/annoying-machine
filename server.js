// Dependencies
var path = require('path');
var fs = require('fs');
var express = require('express');
var util = require('util');
var say = require('say');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(5000, function() {
    console.log('Server listening on port 5000');
}); //Create the server

var io = require('socket.io')(server); //Create the websockets server

var sendComments = function(socket) {
    fs.readFile('_comments.json', 'utf8', function(err, comments) { //read in the comments JSON file
        comments = JSON.parse(comments);
        socket.emit('comments', comments);
    });
};

io.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log('New client connected from ' + address); //terminal output saying that a new client has connected
    socket.on('fetchComments', function() {
        sendComments(socket);
    });

    socket.on('newComment', function(comment, callback) {
        fs.readFile('_comments.json', 'utf8', function(err, comments) {
            comments = JSON.parse(comments);
            comments.push(comment);
            commentAuthor = (comment.author);
            commentBody = (comment.text);

            if (commentAuthor.indexOf('hatespeech') > -1 || commentBody.indexOf('hatespeech') > -1 || commentAuthor.indexOf('censored') > -1 || commentBody.indexOf('censored') > -1 || commentAuthor.indexOf('asdf') > -1 || commentBody.indexOf('asdf') > -1 || commentAuthor.indexOf('asdf') > -1 || commentBody.indexOf('asdf') > -1) { //anti-spam and anti-troll measure
                console.log("Yeah, no.");
                comment.author = "This is why we can't have nice things.";
                comment.text = "Instead of my message, enjoy this: https://www.youtube.com/watch?v=dQw4w9WgXcQ" //a way to troll people when they start writing stuff they shouldn't
                fs.writeFile('_comments.json', JSON.stringify(comments, null, 4), function(err) {
                    io.emit('comments', comments);
                    callback(err);
                });
            } else if (commentAuthor.length <= 30 && commentBody.length <= 50) { //check for client side manipulation to get around char limits
                say.speak(commentAuthor + " says " + commentBody); //read it aloud
                fs.writeFile('_comments.json', JSON.stringify(comments, null, 4), function(err) { //write the new comment to the file
                    io.emit('comments', comments);
                    callback(err);
                });
            }
        });
    });
});
