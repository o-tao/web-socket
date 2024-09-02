$(document).ready(() => {
    console.log("Socket!!");
    // WebSocket 대상 호스트(DNS) 정보
    const server = "http://192.168.0.9:80";
    // WebSocket 접속 정보가 저장 될 변수 (접속 유지용)
    var stompClient = null;

    // 사용자 기본 정보 객체 (DTO와 동일하게 사용 가능)
    class User {
        constructor(userNo, userNm) {
            this.userNo = userNo;
            this.userNm = userNm;
        }
    }

    // 화면 "접속 테스트" 버튼 클릭으로 실행 되는 함수 (Back-End 상태 확인)
    const EVENT1 = (method, url) => {
        $.ajax({
            method: method,
            url: server + url,
            success: SUCCESS,
            error: ERROR
        });
    };
    // EVENT1에서 성공 시 실행 되는 함수 (WebSocket 접속)
    const EVENT2 = (res, endpoint) => {
        if (res) {
            console.log("1단계", res);
            stompClient = Stomp.over(new SockJS(endpoint));
            stompClient.connect({}, frame => {
                console.log("2단계", frame);
                stompClient.subscribe("/topic/bean", EVENT3);
            }, ERROR);
        }
    };
    // 전달 받을 대상 구독 이벤트 (메세지 받는 부분)
    const EVENT3 = msg => console.log("4단계", JSON.parse(msg.body));
    // AJAX 성공 시 실행하는 함수
    const SUCCESS = res => EVENT2(res, server + "/ws-app");
    // AJAX 실패 시 실행하는 함수
    const ERROR = res => console.log("error", res);
    // 화면 "접속 테스트" 버튼 클릭 시 실행 되는 이벤트
    $("#btn1").on("click", () => EVENT1("GET", "/"));
    // 화면 form 이벤트 발생 시 실행 되는 이벤트 (메세지 전송 이벤트)
    $("form").on("submit", e => {
        e.preventDefault();
        console.log("3단계");
        stompClient.send("/msg/conn", {}, JSON.stringify(new User(Math.random(), $("#userNm").val())));
    });
    $("#disconnect").on("click", () => {
        stompClient.disconnect(() => {
            console.log("연결 종료");
        });
    });
});