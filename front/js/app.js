$(document).ready(()=> {
    console.log("Ready!!");

    $( "form" ).on( "submit", function( event ) {
        event.preventDefault();  // form이 가지고 있는 이벤트 정지
        console.log($("#userNm").val(), $("#userPwd").val());
        let params = {
            userNm : $("#userNm").val(),
            userPwd : $("#userPwd").val()
        }
        console.log(params);
        // {params} == {params: params}

        $.post("http://localhost:80/login", params)
            .done(res => {
                console.log(res)
                if(res.status) {
                    $("#content1").addClass("d-none");
                    $("#content2").removeClass("d-none");

                    $("nav li").eq(0).addClass("d-none");
                    $("nav li").eq(1).removeClass("d-none");
                    $("nav li").eq(2).removeClass("d-none");

                    $("#userName").val(res.user.userNm);

                    $("#roles").empty();
                    $.each(res.roles, (i, role) => {
                        let html = `<li class="list-group-item">${role.roleNm}</li>`;
                        $("#roles").append(html);
                    });
                } else {
                    alert("사용자 정보가 일치하지 않습니다.");
                }
            })
            .fail(res => console.log(res));
/*
        $.ajax({
            method: "POST",
            url: "http://localhost:80/token",
            beforeSend : function(xhr){
                xhr.setRequestHeader("Authorization", "Token");
            },
            success: function(res) {
                console.log(res);
            },
            error: function(res) {
                console.log(res)
            }
        });
*/

    });
});