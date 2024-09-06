$(document).ready(() => {
    const host = "http://192.168.0.52:8080";
    const host2 = "http://192.168.0.67:9000";
    var list = [];
    const renderEvent = (data) => {
        list = data;
        $("#list").empty();
        $.each(data, (index, item) => {
            let html = `<a class="list-group-item m-1 ${item.accept ? 'bg-success' : 'bg-warning'} display-6" no="${item.no}">${item.title}</a>`;
            $("#list").prepend(html);
        });
        detailEvent();
        socket();
    }
    const errorEvent = (data) => console.log(data);
    const detailEvent = () => {
        $("#list > a").on("click", (e) => {
            e.preventDefault();
            if (localStorage.getItem("token") != null) {
                //var index = $("#list > a").index(e.target);
                var no = $(e.target).attr("no");
                location.href = "/v2/detail.html#" + no;
            } else {
                alert("로그인 후 이용하세요.")
            }
        });
    }
    const getData = (url) => {
        $.post(url).done(renderEvent).fail(errorEvent);
    }
    $("#nav > a").on("click", (e) => {
        e.preventDefault();
        var index = $("#nav > a").index(e.target);
        switch (index) {
            case 1:
                getData(host + "/v2/findList/1");
                break;
            case 2:
                getData(host + "/v2/findList/0");
                break;
            case 3:
                location.href = "/v2/new.html";
                break;
            default:
                getData(host + "/v2/findList");
                break;
        }
    });

    const socket = () => {
        const socket = new SockJS("http://localhost:80/ws-app");
        const client = Stomp.over(socket);
        // client.debug = () => {};
        client.connect({},
            () => {
                console.log("접속 성공");
                client.subscribe("/topic/accept", res => {
                    // console.log(res);
                    var msg = JSON.parse(res.body);
                    // console.log(msg);
                    $("#list a").each((i, e) => {
                        if ($(e).attr("no") == msg.no) {
                            if (msg.accept) {
                                $(e).addClass("bg-success");
                                $(e).removeClass("bg-warning");
                            } else {
                                $(e).addClass("bg-warning");
                                $(e).removeClass("bg-success");
                            }
                        }
                    });
                })
            },
            res => console.log(res)
        );
    }

    // // 모달 방식 로그인 이벤트
    // $(".server").on("click", () => {
    //     $('#modal').toggle();
    // });
    // $("#close").on("click", () => $('#modal').hide());
    //
    // $(window).on('click', function (event) {
    //     if ($(event.target).is('#modal')) {
    //         $('#modal').hide();
    //     }
    // });
    //
    // // 로그인 버튼 선택시 동작이벤트
    // $("form#loginForm").on("submit", e => {
    //     e.preventDefault();
    //     localStorage.setItem("userNm", $("#username").val());
    //     $('#modal').hide();
    // });

    $("#myModal form").on("submit", e => {
        e.preventDefault();
        let params = {
            userNm: $("#userNm").val(),
            userPwd: $("#userPwd").val()
        }
        $.post(host2 + "/login", params)
            .done(res => {
                if (res.state) {
                    localStorage.setItem("token", res.token);
                    $('#myModal').modal('hide');
                    /*
                    alert(res.userNm + "님 환영 합니다.");
                    */
                } else {
                    alert("유효한 사용자가 아닙니다.");
                }
            })
            .fail(errorEvent);
    });

    getData(host + "/v2/findList");
});