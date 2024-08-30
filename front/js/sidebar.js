$(document).ready(function() {

    const server = "http://localhost:8080";
    var stompClient = null;
    class User {
        constructor(userNo, userNm, message, time) {
            this.userNo = userNo;
            this.userNm = userNm;
            this.message = message;
            this.time = time;
        }
    };
    const EVENT1 = (endpoint, topic) => {
        console.log("1단계");
        stompClient = Stomp.over(new SockJS(endpoint));
        stompClient.connect({}, frame => {
            console.log("2단계", frame);
            stompClient.subscribe(topic, EVENT2);
        }, ERROR);
    };
    const EVENT2 = msg => console.log("4단계", JSON.parse(msg.body));
    const EVENT3 = (prefixes, user) => {
        console.log("3단계");
		stompClient.send(prefixes, {}, JSON.stringify(user));
    };
    // 웹소켓에서 전달 받은 메세지 출력 이벤트
    const DRAW = (user) => {
        let html = `<div class="message ${user.userNo == 2 ? 'message-right' : 'message-left'}">
                <h3 class="message-user">${user.userNm}:</h3>
                <div class="message-body">
                    <p class="message-content">${user.message}</p>
                    <p class="message-time ${user.userNo == 2 ? 'message-left' : 'message-right'}message-right">${user.time}</p>
                </div>
            </div>`;
        $(".messages").append(html);
    };

    // 슬라이드 이벤트 
    $('#logo').on('click', () => {
        let width = $('#sidebar').width();
        $(".server-txt").hide();
        $(".channel-txt").hide();
        $('#sidebar').animate({ width: (width === 250) ? 70 : 250 }, 500, ()=> {
            if(width === 70) {
                $(".server-txt").show();
                $(".channel-txt").show();
            }
        });        
    });

    const fnChannelEvent = () => {
        // 채널 목록 중 하나를 선택하면 발생하는 이벤트
        $(".channel").off().on("click", function() {
            $("#channel").text($(this).children(".channel-txt").text());
            $("#message").attr("readonly",false);
            $("#messageForm button").attr("disabled", false);
            const list = [
                new User(1, "류관순", "안녕하세요!", "15:23"),
                new User(2, "홍길동", "안녕!!", "15:25")
            ];
            $(".messages").empty();
            list.forEach(user => DRAW(user));

            // 웹소켓 호출 부분
            //EVENT1(server+"/ws-app", "/topic/bean");
        });
    };

    $("#socketClose").on("click", () => {
        $("#channel").text("");
        $("#message").attr("readonly",true);
        $("#messageForm button").attr("disabled", true);
        $(".messages").empty();
    });

    // 모달 방식 로그인 이벤트
    $(".server").on("click", () => {
        $('#modal').toggle();
    });
    $("#close").on("click", ()=>$('#modal').hide());
    $(window).on('click', function(event) {
        if ($(event.target).is('#modal')) {
            $('#modal').hide();
        }
    });
    $("form#loginForm").on("submit", e => {
        e.preventDefault();
        alert("loginForm!!");
    });

    // 메세지 전송 이벤트
    $("form#messageForm").on("submit", e => {
        e.preventDefault();
        alert("messageForm!!");

        /************************************
         * #전송하는 대상자 정보 및 메세지 담기
         * @userNo : 사용자 번호
         * @userNm : 사용자 이름
         * @message : 메세지 내용
         * @time : 전송하는 시간
         ************************************/
        //var user = new User(userNo, userNm, message, time);
        // 웹소켓 메세지 전송 부분
        //EVENT3("/msg/conn", user);
    });

    const fnChannel = () => {
        const channels = [
            {channelNo: 1, channelNm: "야놀자", prefixes: "/topic/bean1", topic: "/msg/conn1"},
            {channelNo: 2, channelNm: "쿡방", prefixes: "/topic/bean2", topic: "/msg/conn2"},
            {channelNo: 3, channelNm: "배민", prefixes: "/topic/bean3", topic: "/msg/conn3"}
        ];

        channels.forEach(channel => {
            let html = `<li class="channel"># <span class="channel-txt">${channel.channelNm}</span></li>`;
            $("#channel-list").append(html);
        });

        fnChannelEvent();
    }
    fnChannel();
});
