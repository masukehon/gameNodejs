$(document).ready(function() {

    var speedKhungHinh = 700;
    //khoảng cách mà máy bay đi được trong mỗi lần di chuyển
    var distanceBay = 70;
    var speedChay = 500;
    var speedDan = 3500;
    //Mỗi phát đạn bắn ra cách nhau 1,5s
    var hitDelay = 500;
    var hitDelayBool1 = false;
    var hitDelayBool2 = false;
    var lifePlayer1 = 500;
    var lifePlayer2 = 500;
    var damage = 20;
    var gameOver = true;
    var player = '';



    function KhungHinhAnimation() {

        $('#container').css({ 'animation': 'animatedBackground ' + speedKhungHinh + 's linear infinite' });
    }

    function HitPlayer1() {

        if (gameOver)
            return;

        if (!hitDelayBool1) {
            hitDelayBool1 = true;
            var temptTop = $('#player1').offset().top + $('#player1').height() - 20;
            var temptLeft = $('#player1').offset().left + $('#player1').width();

            var bullet = $("<img/>", {
                "class": "bullet1",
                "src": "../images/bullet.png",
            });
            bullet.css({
                top: temptTop + "px",
                left: temptLeft + "px"
            });

            $("#container").append(bullet);

            var finish = $('#container').width() - 35;
            bullet.animate({ "left": finish + "px" }, speedDan);
            setTimeout(function() {
                    bullet.remove();
                },
                speedDan - 50);
            setTimeout(function() {
                    hitDelayBool1 = false;
                },
                hitDelay);
            return bullet;
        }
    }

    function HitPlayer2() {

        if (gameOver)
            return;

        if (!hitDelayBool2) {
            hitDelayBool2 = true;
            var temptTop = $('#player2').offset().top + $('#player1').height() - 20;
            var temptRight = $('#player2').offset().left;

            var bullet = $("<img/>", {
                "class": "bullet2",
                "src": "../images/bullet.png",
            });

            bullet.css({
                top: temptTop + "px",
                left: temptRight + "px"
            });
            $("#container").append(bullet);

            var finish = 35;
            bullet.animate({ "left": finish + "px" }, speedDan);
            setTimeout(function() {
                    bullet.remove();
                },
                speedDan - 50);
            setTimeout(function() {
                    hitDelayBool2 = false;
                },
                hitDelay);
            return bullet;
        }
    }

    //máy bay 2 bị trúng đạn
    function BulletedPlayer1(bullet) {

        if (gameOver) return;

        setInterval(function() {
            if (typeof bullet !== 'undefined') {
                var temptTop = $('#player2').offset().top;
                var temptLeft = $('#player2').offset().left;
                var temptRight = temptLeft + $('#player2').width();
                var temptBot = temptTop + $('#player2').height();


                var temptTopBullet = bullet.offset().top;
                var temptLeftBullet = bullet.offset().left;
                var temptRightBullet = temptLeftBullet + bullet.width();
                var temptBotBullet = temptTopBullet + bullet.height();

                if (temptRightBullet > temptLeft && temptRightBullet < temptRight) {
                    if (temptLeftBullet > temptLeft && temptRightBullet < temptRight) {
                        if (temptTopBullet > temptTop && temptTopBullet < temptBot) {
                            if (temptBotBullet > temptTop && temptBotBullet < temptBot) {

                                bullet.remove();
                                var plane = $('#player2');
                                plane.attr("src", "../images/heli-player2-bulleted.png");

                                setTimeout(function() {
                                    plane.attr("src", "../images/heli-player2.png");
                                }, 100)

                                socket.emit('bulleted', { player: "Player2" });

                            }
                        }
                    }
                }
            }
        }, 30);
    }

    //máy bay 1 bị trúng đạn
    function BulletedPlayer2(bullet) {

        if (gameOver) return;


        setInterval(function() {
            if (typeof bullet !== 'undefined') {

                var temptTop = $('#player1').offset().top;
                var temptLeft = $('#player1').offset().left;
                var temptRight = temptLeft + $('#player1').width();
                var temptBot = temptTop + $('#player1').height();

                var temptTopBullet = bullet.offset().top;
                var temptLeftBullet = bullet.offset().left;
                var temptRightBullet = temptLeftBullet + bullet.width();
                var temptBotBullet = temptTopBullet + bullet.height();

                if (temptLeftBullet > temptLeft && temptLeftBullet < temptRight) {
                    if (temptRightBullet > temptLeft && temptRightBullet < temptRight) {
                        if (temptTopBullet > temptTop && temptTopBullet < temptBot) {
                            if (temptBotBullet > temptTop && temptBotBullet < temptBot) {

                                bullet.remove();
                                var plane = $('#player1');
                                plane.attr("src", "../images/heli-player1-bulleted.png");

                                setTimeout(function() {
                                    plane.attr("src", "../images/heli-player1.png");
                                }, 100)

                                socket.emit('bulleted', { player: "Player1" });

                            }
                        }
                    }
                }
            }
        }, 30);
    }


    // $('#playGame').click(function() {

    //     $('#player1').show();
    //     $('#player2').show();
    //     $('#lifePlayer1').show();
    //     $('#lifePlayer2').show();
    //     $(this).hide();
    //     KhungHinhAnimation();

    // });

    var checkGameOver = setInterval(function() {

        if (lifePlayer2 <= 0) {

            $(".bullet1").hide();
            $(".bullet2").hide();

            setTimeout(function() {
                $('#player2').attr("src", "../images/heli-player2-die.png");
                $('#player2').css({ "transform": "rotate(290deg)" });
            }, 100);

            setTimeout(function() {
                MayBayRoi("player2");
                gameOver = true;
            }, 500);
            clearInterval(checkGameOver);
        }
        if (lifePlayer1 <= 0) {

            $(".bullet1").hide();
            $(".bullet2").hide();

            setTimeout(function() {
                $('#player1').attr("src", "../images/heli-player1-die.png");
                $('#player1').css({ "transform": "rotate(70deg)" });
            }, 100);

            setTimeout(function() {
                MayBayRoi("player1");
                gameOver = true;
            }, 500);
            clearInterval(checkGameOver);
        }
    }, 50);

    function MayBayRoi(player) {

        var destination = $("#container").height() - $("#" + player).height();
        $("#" + player).animate({ top: destination + "px" }, 2000);
        setTimeout(function() {
            $("#" + player).hide();
        }, 1500);

        setTimeout(function() {
            alert("Game Over!");
        }, 2000);
    }

    //không có biến này thanh máu khi tụt sẽ bị lag 
    //khi bắn quá nhiều đạn 3viên/s vì hàm animate cùi mía

    var temptMauPlayer1 = $("#life1").offset().left;
    var temptMauPlayer2 = $("#life2").offset().left;

    //firefox: 15 viên thì hêt máu ???
    //coccoc: 25 viên thì hêt máu ???
    //nà ní ??
    function MatMau(player) {
        if (gameOver) return;
        var ratio = 500 / damage;
        //ratio = 25 viên thì hết máu

        var distance = $("#life1").width() / ratio;
        //distance = 14 ; life1 = 350px



        //máy bay 2 bị trúng đạn
        if (player == "Player2") {

            temptMauPlayer2 -= distance;

            lifePlayer2 -= damage;
            $('#life2').stop().animate({ "left": temptMauPlayer2 + "px" });

        } else if (player == "Player1") {
            //máy bay 1 bị trúng đạn

            temptMauPlayer1 -= distance;

            lifePlayer1 -= damage;
            $('#life1').stop().animate({ "left": temptMauPlayer1 + "px" });
        }
    }

    $('#createGame').click(function() {

        player = "Player1";
        socket.emit('createGame', { player: "Player1" });

    });

    $('#joinGame').click(function() {
        $('#createGame').hide();
        $('#joinGame').hide();
        $('#insertCode').show();
    });



    var socket = io.connect();
    // var socket2 = io.connect('http://localhost:3000');

    $('#insertCode input[type="button"]').click(function() {

        var code = $('#insertCode input[type="text"]').val();

        socket.emit('waitForJoinRoom', { code: code });
        player = "Player2";

    });

    socket.on('playGame', function(data) {

        if (!data.gameOver) {

            gameOver = false;
            $('#player1').show();
            $('#player2').show();
            $('#lifePlayer1').show();
            $('#lifePlayer2').show();
            $('#playGame').hide();
            $('#insertCode').hide();
            $('#code').hide();
            KhungHinhAnimation();
        } else
            console.log("Error");
    });

    socket.on('createCode', function(data) {

        $('#createGame').hide();
        $('#joinGame').hide();
        $('#code').show();
        if (data) {
            $('#code p:last-child').html(data.code);

        } else
            $('#code').html('Error. Please press F5');
    });

    $(document).keydown(function(e) {

        socket.emit('playerMove', { key: e.which, player: player });
    });

    socket.on('move', function(data) {

        //32: space
        //38: up
        //37: left
        //39: right
        //40: down

        if (data.player == "Player1") {

            var limitTop = $('#container').offset().top + $('#player1').height();
            var limitLeft = $('#container').offset().left + 55;
            var limitBot = $('#container').height() - 150;
            var limitRight = $('#container').width() / 2 - $('#player1').width();
            var planeTop = $('#player1').offset().top;
            var planeLeft = $('#player1').offset().left;

            if (data.key == 40 && planeTop < limitBot) {
                $('#player1').stop().animate({ top: "+=" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 38 && planeTop > limitTop) {
                $('#player1').stop().animate({ top: "+=-" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 37 && planeLeft > limitLeft) {
                $('#player1').stop().animate({ left: "+=-" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 39 && planeLeft < limitRight) {
                $('#player1').stop().animate({ left: "+=" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 32) {
                var bullet = HitPlayer1();
                BulletedPlayer1(bullet);
            }
        }
        if (data.player == "Player2") {

            var limitTop = $('#container').offset().top + $('#player2').height();
            var limitLeft = $('#container').width() / 2 + $('#player2').width();
            var limitBot = $('#container').height() - 150;
            var limitRight = $('#container').width() - 70;
            var planeTop = $('#player2').offset().top;
            var planeRight = $('#player2').offset().left + $('#player2').width();

            if (data.key == 40 && planeTop < limitBot) {
                $('#player2').stop().animate({ top: "+=" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 38 && planeTop > limitTop) {
                $('#player2').stop().animate({ top: "+=-" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 37 && planeRight > limitLeft) {
                $('#player2').stop().animate({ left: "+=-" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 39 && planeRight < limitRight) {
                $('#player2').stop().animate({ left: "+=" + distanceBay + "px" }, speedChay);
            }
            if (data.key == 32) {
                var bullet = HitPlayer2();
                BulletedPlayer2(bullet);

            }
        }

    });

    socket.on('bleed', function(data) {
        if (data.player == "Player1")
            MatMau(data.player);
        else if (data.player == "Player2")
            MatMau(data.player);
    });





});