/* 
* @Author: Marte
* @Date:   2017-01-08 12:18:47
* @Last Modified by:   Marte
* @Last Modified time: 2017-01-09 14:07:03
*/
var fs = require('fs'), 
    http = require('http'), 
    socketio = require('socket.io'),
    _ = require('underscore');
var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync('./demo.html'));
}).listen(3000, function() {
    console.log('Listening at: http://localhost:3000');
});         
var userList= [];
var io=socketio.listen(server);
io.on('connection',function(socket){
  //console.log(socket);
  socket.emit('getinfo',null);
  
  socket.on('login',function(user){
    user.id = socket.id;
    console.log(user);
    userList.push(user);
    console.log(userList);
  });
  socket.on('hello',function(info){
    console.log(info);
    user = _.findWhere(userList,{id:socket.id});
    info.from = user.username;
    helloUser = _.findWhere(userList,{username:info.username});
    console.log(helloUser);
    var toSocket = _.findWhere(io.sockets.sockets,{id:helloUser.id});
    //console.log(toSocket);
    message = info.message;
    toSocket.emit('sayhello', {from:user.username,message:message});
  });
});