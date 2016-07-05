var express = require('express'), 
    app = express(),
    http = require('http'),
    io = require('socket.io');

var easyrtc = require("easyrtc");           // EasyRTC external module
    
var server = http.createServer(app);
var server2 = http.createServer(app);

var io = io.listen(server);

app.use("/js", express.static(__dirname + '/easyrtc/js'));
app.use("/images", express.static(__dirname + '/easyrtc/images'));
app.use("/css", express.static(__dirname + '/easyrtc/css'));

server.listen(process.env.PORT || 8888);

app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

// array of all lines drawn
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history 
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });
});


//Initiate a video call
app.get('/video', function(req, res){
	var easyrtcServer = easyrtc.listen(app, socketServer, {'apiEnable':'true'});
        res.sendfile(__dirname + '/easyrtc/demo_multiparty.html');

});


var socketServer = io.listen(server2);