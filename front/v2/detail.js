$(document).ready(() => {
	const host = "http://localhost:8080";
	let map = {};
	let no = location.hash.substring(1); //0;
	//let paths = location.pathname.split("/");
	let type = false;
	const styleEvent = (accept) => {
		if(accept) {
			$("a.link").text("미승인");
			$("a.link").removeClass("btn-success");
			$("a.link").addClass("btn-warning");
		} else {
			$("a.link").text("승인");
			$("a.link").removeClass("btn-warning");
			$("a.link").addClass("btn-success");
		}
	}
	const renderEvent = (data) => {
		if(data.status) {
			map = data;
			$("#title").val(map.title);
			$("#content").val(map.content);
			styleEvent(map.accept);
			if(type) alert("수정이 성공 하였습니다.");
		} else {
			alert("수정이 실패 하였습니다.");
			linkEvent();
		}
		type = true;
	}
	const errorEvent = (data) => console.log(data);
	const linkEvent = () => {
		location.href = "/v2/list.html";
	}
	const syncData = (url, params) => {
		$.post(url, params).done(renderEvent).fail(errorEvent);
	}
	$("form").on("submit", (e) => {
		e.preventDefault();
		var params = {
			no : map.no,
			title : $("#title").val(),
			content : $("#content").val()
		}
		syncData(host+"/v2/edit", params);
	});
	$("a.link").on("click", (e)=> {
		e.preventDefault();
		if(map.accept) {
			syncData(host+"/v2/detail/" + no + "/0", {});
		} else {
			syncData(host+"/v2/detail/" + no + "/1", {});
		}
	});
	if(no != "") {
		//no = paths[3];
		syncData(host+"/v2/detail/" + no, {});
	} else {
		linkEvent();
	}
});