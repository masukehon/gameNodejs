var mongoose = require('mongoose');

var io;
var socket;
var codeRoom;

exports.initGame = function(sio, skt) {
    io = sio;
    socket = skt;

    socket.on('createGame', createGame);
    socket.on('waitForJoinRoom', waitForJoinRoom);
    socket.on('playerMove', playerMove);
    socket.on('bulleted', bulleted);

    // socket.on('checkBulletedPlayer2', checkBulletedPlayer2);
    // socket.on('checkBulletedPlayer1', checkBulletedPlayer1);

}

function createGame(data) {

    var code = Math.floor((Math.random() * 100000) + 1);

    socket.emit('createCode', { code: code });

    this.join(code);

    //code dưới lấy được số người đã kết nối vào room
    io.of('/').in(code).clients(function(error, clients) {
        var numClients = clients.length;
        console.log("Player1: " + numClients);

    });
}

function waitForJoinRoom(data) {

    socket.nickname = "Player2";
    socket.join(data.code);
    var numClients = 0;

    //code dưới lấy được số người đã kết nối vào room
    io.of('/').in(data.code).clients(function(error, clients) {
        numClients = clients.length;
        if (numClients == 2) {
            console.log('ok');
            io.sockets.in(data.code).emit('playGame', { gameOver: false });
            codeRoom = data.code;
            console.log('ok');

        }
    });
}

function playerMove(data) {
    //32: space
    //38: up
    //37: left
    //39: right
    //40: down

    if (data.key == 32 || data.key == 37 || data.key == 38 || data.key == 39 || data.key == 40) {
        io.sockets.in(codeRoom).emit('move', { player: data.player, key: data.key });
    }
}

function bulleted(data) {
    io.sockets.in(codeRoom).emit('bleed', { player: data.player });
}

function checkBulletedPlayer2(data) {
    io.sockets.in(codeRoom).emit('checkBullet2', { bullet: data.bullet });
}

function checkBulletedPlayer1(data) {
    io.sockets.in(codeRoom).emit('checkBullet1', { bullet: data.bullet });
}