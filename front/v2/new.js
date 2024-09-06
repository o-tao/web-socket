$(document).ready(() => {
    const host = "http://192.168.0.52:8080";
    const linkEvent = (data) => {
        if (data.no != undefined) {
            alert("작성이 성공 하였습니다.");
            location.href = "/v2/detail.html#" + data.no;
        } else {
            alert("작성이 실패 하였습니다.");
        }
    }
    const errorEvent = (data) => console.log(data);
    const setData = () => {
        var params = {
            title: $("#title").val(),
            content: $("#content").val()
        }
        $.post(host + "/v2/save", params).done(linkEvent).fail(errorEvent);
    }
    $("form").on("submit", (e) => {
        e.preventDefault();
        setData();
    });
});