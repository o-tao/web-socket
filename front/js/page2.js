$(document).ready(() => {
    const server = "http://192.168.0.8:8080/ws-app";
    const prefixes = "/msg/set"
    const topic = "/topic/get"

    var client = null;
    var message = null;
    var time = null;
    var userNm = null;

    class ResultData {
        constructor(message, time, userNm) {
            this.message = message;
            this.time = time;
            this.userNm = userNm;
        }
    }

    // 접속 성공
    const EVENT1 = () => {
        console.log("접속 성공");
        client.subscribe(topic, EVENT4);
    };

    // 접속 실패
    const EVENT2 = () => console.log("접속 실패");

    // 접속성공시 클라이언트 커넥션
    const EVENT3 = (data) => {
        // console.log(client);
        if (client.connected) {
            client.send(prefixes, {}, JSON.stringify(data));
        } else {
            alert("소켓 정보 없당.");
        }
    };

    // 메세지 화면에 띄우기
    const EVENT4 = msg => DRAW(JSON.parse(msg.body));

    // 채널접속 버튼 클릭시 커넥트
    const EVENT5 = () => {
        client = Stomp.over(new SockJS(server));
        client.connect({}, EVENT1, EVENT2);
    }

    // 메세지 화면에 띄우기
    const DRAW = (msg) => {
        let messagePosition = isValidUse(msg.userNm) ? 'message-right' : 'message-left';
        let messageContentPosition = isValidUse(msg.userNm) ? 'message-content-right' : 'message-content-left';
        let messageTimePosition = isValidUse(msg.userNm) ? 'message-right' : 'message-left';
        let html = `<div class="message ${messagePosition}">
                <h3 class="message-user">${msg.userNm}</h3>
                <div class="message-body">
                    <p class="message-content ${messageContentPosition}">${msg.message}</p>
                    <p class="message-time ${messageTimePosition}">${msg.time}</p>
                </div>
            </div>`;
        $(".messages").append(html);
        $(".messages").scrollTop($(".messages")[0].scrollHeight);
    }

    const isValidUse = (userNm) => {
        return userNm == localStorage.getItem("userNm");
    };

    // 전송버튼 클릭시 메세지 보내기
    $("form#messageForm").on("submit", e => {
        e.preventDefault();
        if (localStorage.getItem("userNm") == null) {
            $("#message").val("");
            $("#modal").toggle();
            return;
        }
        var data = new ResultData($("#message").val(), "", localStorage.getItem("userNm"));
        // console.log(message);
        $("#message").val("");
        EVENT3(data);
    });

    // 채널접속시 클라이언트 커넥트
    $("#btn2").on("click", () => {
        EVENT5();
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

    // 로그인 버튼 선택시 동작이벤트
    $("form#loginForm").on("submit", e => {
        e.preventDefault();
        localStorage.setItem("userNm", $("#username").val());
        $('#modal').hide();
    });
});