$(document).ready(() => {
	const host = "http://localhost:8080";
	var list = [];
	const renderEvent = (data) => {
		list = data;
		$("#list").empty();
		$.each(data, (index, item) => {
			let html = `<a class="list-group-item m-1 ${item.accept? 'bg-success' : 'bg-warning'} display-6" no="${item.no}">${item.title}</a>`;
			$("#list").prepend(html);
		});
		detailEvent();
	}
	const errorEvent = (data) => console.log(data);
	const detailEvent = () => {
		$("#list > a").on("click", (e) => {
			e.preventDefault();
			//var index = $("#list > a").index(e.target);
			var no = $(e.target).attr("no");
			location.href = "/v2/detail.html#" + no;
		});
	}
	const getData = (url) => {
		$.post(url).done(renderEvent).fail(errorEvent);
	}
	$("#nav > a").on("click", (e)=> {
		e.preventDefault();
		var index = $("#nav > a").index(e.target);
		switch(index) {
			case 1:
				getData(host+"/v2/findList/1");
				break;
			case 2:
				getData(host+"/v2/findList/0");
				break;
			case 3:
				location.href = "/v2/new.html";
				break;
			default:
				getData(host+"/v2/findList");
				break;
		}
	});
	getData(host+"/v2/findList");
});