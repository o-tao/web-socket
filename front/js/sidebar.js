$(document).ready(function () {

    const server = "http://192.168.0.6:80";
    var stompClient = null;
    var message = null;
    var user = null;
    var prefixe = null;

    class Payload {
        constructor(message, user) {
            this.message = message;
            this.user = user;
        }
    }

    class Message {
        constructor(topic, message, time) {
            this.topic = topic;
            this.message = message;
            this.time = time;
        }

        setMessage(msg) {
            this.message = msg;
        }
    }

    class User {
        constructor(userNm) {
            this.userNm = userNm;
        }
    }

    // 채널입장 이벤트
    const EVENT1 = (endpoint) => {
        console.log("1단계");
        stompClient = Stomp.over(new SockJS(server + endpoint));

        stompClient.debug = () => {
        };

        stompClient.connect({}, EVENT5, error => {
            console.log("ERROR", error);
            alert("서버가 종료 되었습니다.");
            resetForm();
        });
    };

    const EVENT2 = msg => DRAW(JSON.parse(msg.body)); //console.log("4단계", JSON.parse(msg.body));

    const EVENT3 = (prefixes, payload) => {
        console.log("3단계");
        stompClient.send(prefixes, {}, JSON.stringify(payload));
    };

    // 종료 이벤트
    const EVENT4 = () => {
        stompClient.disconnect(() => {
            console.log("연결 종료");
        });
    }

    const EVENT5 = () => {
        if (message != null) {
            stompClient.subscribe(message.topic, EVENT2);
        }
    }

    // 웹소켓에서 전달 받은 메세지 출력 이벤트
    const DRAW = (payload) => {
        let messagePosition = isValidUse(payload) ? 'message-right' : 'message-left';
        let messageContentPosition = isValidUse(payload) ? 'message-content-right' : 'message-content-left';
        let messageTimePosition = isValidUse(payload) ? 'message-left' : 'message-right';
        let html = `<div class="message ${messagePosition}">
                <h3 class="message-user">${payload.user.userNm}:</h3>
                <div class="message-body">
                    <p class="message-content ${messageContentPosition}">${payload.message.message}</p>
                    <p class="message-time ${messageTimePosition}">${payload.message.time}</p>
                </div>
            </div>`;
        $(".messages").append(html);

        // 스크롤을 최신 메시지로 자동으로 내리기
        $(".messages").scrollTop($(".messages")[0].scrollHeight);
    };

    const isValidUse = (payload) => {
        return payload.user.userNm == localStorage.getItem("userNm");
    };

    const resetForm = () => {
        $("#channel").text("");
        $("#message").attr("readonly", true);
        $("#messageForm button").attr("disabled", true);
        $(".messages").empty();
    };

    // 연결된 소켓 접속 종료 이벤트
    $("#socketClose").on("click", () => {
        resetForm();
        EVENT4();
    });

    // 슬라이드 이벤트 
    $('#logo').on('click', () => {
        let width = $('#sidebar').width();
        $(".server-txt").hide();
        $(".channel-txt").hide();
        $('#sidebar').animate({width: (width === 250) ? 70 : 250}, 500, () => {
            if (width === 70) {
                $(".server-txt").show();
                $(".channel-txt").show();
            }
        });
    });

    // 모달 방식 로그인 이벤트
    $(".server").on("click", () => {
        $('#modal').toggle();
    });
    $("#close").on("click", () => $('#modal').hide());
    $(window).on('click', function (event) {
        if ($(event.target).is('#modal')) {
            $('#modal').hide();
        }
    });
    $("form#loginForm").on("submit", e => {
        e.preventDefault();
        // alert("loginForm!!");
        localStorage.setItem("userNm", $("#username").val());
        $('#modal').hide();
    });

    // 메세지 전송 이벤트
    $("form#messageForm").on("submit", e => {
        e.preventDefault();
        if (localStorage.getItem("userNm") == null) {
            $("#message").val("");
            $('#modal').toggle();
            return;
        }
        user = new User(localStorage.getItem("userNm"));
        message.setMessage($("#message").val());
        var payload = new Payload(message, user);
        $("#message").val("");
        EVENT3(prefixe, payload);
    });

    const fnChannelEvent = (channels) => {
        // 채널 목록 중 하나를 선택하면 발생하는 이벤트
        $(".channel").off().on("click", function () {
            $("#channel").text($(this).children(".channel-txt").text());
            $("#message").attr("readonly", false);
            $("#messageForm button").attr("disabled", false);
            $(".messages").empty();
            if (stompClient != null) EVENT4();
            var index = $(".channel").index(this);
            var target = channels[index];
            prefixe = target.prefixe;
            message = new Message(target.topic, "", "");
            EVENT1("/ws-app");
        });
    };

    // 채널 목록을 출력하는 이벤트
    const CHANNEL = res => {
        if (res != null) {
            res.forEach(channel => {
                let html = `<li class="channel"># <span class="channel-txt">${channel.channelNm}</span></li>`;
                $("#channel-list").append(html);
            });
            fnChannelEvent(res);
        }
    }

    // 채널 목록 가져오기 비동기 요청
    $.ajax({
        method: "POST",
        url: server + "/getChannel",
        success: CHANNEL,
        error: res => console.log("error", res)
    });
});
