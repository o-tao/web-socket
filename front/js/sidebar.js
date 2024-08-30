$(document).ready(function() {

    const channels = [
        {channelNo: 1, channelNm: "야놀자", prefixes: "/topic/bean1", topic: "/msg/conn1"},
        {channelNo: 2, channelNm: "쿡방", prefixes: "/topic/bean2", topic: "/msg/conn2"},
        {channelNo: 3, channelNm: "배민", prefixes: "/topic/bean3", topic: "/msg/conn3"}
    ];

    var prefixes = "";

    const server = "http://192.168.0.9:80";
    var stompClient = null;
    class User {
        constructor(userNo, userNm, message, time, prefixes) {
            this.userNo = userNo;
            this.userNm = userNm;
            this.message = message;
            this.time = time;
            this.prefixes = prefixes;
        }
    };

    // 채널입장 이벤트
    const EVENT1 = (endpoint, topic) => {
        console.log("1단계");
        stompClient = Stomp.over(new SockJS(endpoint));
        stompClient.connect({}, frame => {
            console.log("2단계", frame);
            stompClient.subscribe(topic, EVENT2);
        }, error => console.log(error));
    };

    const EVENT2 = msg => DRAW(JSON.parse(msg.body)); //console.log("4단계", JSON.parse(msg.body));

    const EVENT3 = (prefixes, user) => {
        console.log("3단계");
		stompClient.send(prefixes, {}, JSON.stringify(user));
    };

    // 종료 이벤트
    const EVENT4 = () => {
        stompClient.disconnect(() => {
            console.log("연결 종료");
        });
    }

    // 웹소켓에서 전달 받은 메세지 출력 이벤트
    const DRAW = (user) => {
        let html = `<div class="message ${user.userNm == localStorage.getItem("userNm") ? 'message-right' : 'message-left'}">
                <h3 class="message-user">${user.userNm}:</h3>
                <div class="message-body">
                    <p class="message-content">${user.message}</p>
                    <p class="message-time ${user.userNm == localStorage.getItem("userNm") ? 'message-left' : 'message-right'}message-right">${user.time}</p>
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

            //채널 입장시 메세지입력, 버튼 활성화
            $("#message").attr("readonly",false);
            $("#messageForm button").attr("disabled", false);

            // 종료 이벤트
            if(stompClient != null) {
                EVENT4();
            }

            var index = $(".channel").index(this);
            // console.log(index, channels[index], channels[index].prefixes);

            /*
            // 채널 입장 시 메세지 출력
            const list = [
                new User(1, "류관순", "안녕하세요!", "15:23"),
                new User(2, "홍길동", "안녕!!", "15:25")
            ];
            $(".messages").empty();
            list.forEach(user => DRAW(user));
            */

            // 웹소켓 호출 부분(서버 접속을 위한 주소값 + config, 돌려받는 내용)
            // EVENT1(server+"/ws-app", "/topic/bean");
            prefixes = channels[index].prefixes;
            EVENT1(server+"/ws-app", prefixes);
        });
    };

    $("#socketClose").on("click", () => {
        $("#channel").text("");
        $("#message").attr("readonly",true);
        $("#messageForm button").attr("disabled", true);
        $(".messages").empty();
        EVENT4();
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
        // alert("loginForm!!");
        localStorage.setItem("userNm", $("#username").val());
        $('#modal').hide();
    });

    // 메세지 전송 이벤트
    $("form#messageForm").on("submit", e => {
        e.preventDefault();
        // alert("messageForm!!");

        /************************************
         * #전송하는 대상자 정보 및 메세지 담기
         * @userNo : 사용자 번호
         * @userNm : 사용자 이름
         * @message : 메세지 내용
         * @time : 전송하는 시간
         ************************************/
        const currentDate = new Date();
        const formattedDate = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        if (localStorage.getItem("userNm") == "") {
            return;
        }
        var user = new User(1, localStorage.getItem("userNm"), $("#message").val(), formattedDate, prefixes);
        $("#message").val("");
        // 웹소켓 메세지 전송 부분
        EVENT3("/msg/conn", user);
    });

    const fnChannel = () => {

        channels.forEach(channel => {
            let html = `<li class="channel"># <span class="channel-txt">${channel.channelNm}</span></li>`;
            $("#channel-list").append(html);
        });

        fnChannelEvent();
    }
    fnChannel();
});
