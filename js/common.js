var day = ['','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัส','วันศุกร์','วันเสาร์','วันอาทิตย์'];
var month = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
var notifications = [];
var notificationTimeout = 20000;

if(localStorage.debug!=undefined&&localStorage.debug=='true'){
		var isDebug = true;
}else{
		var isDebug = false;
}

function justTime(t){
	var diffTime = Math.ceil((new Date().getTime()-t)/1000);
	if(diffTime<60){
		return "ประมาณ "+Math.ceil(diffTime)+" วินาทีที่แล้ว";
	}else if(diffTime<3600){
		return "ประมาณ "+Math.ceil(diffTime/60)+" นาทีที่แล้ว";
	}else if(diffTime<86400){
		return "ประมาณ "+Math.ceil(diffTime/3600)+" ชั่วโมงที่แล้ว";
	}else if(diffTime<172800){
		return "เมื่อวานนี้";
	}else if(diffTime<691200){
		return "เมื่อ"+day[new Date(t).getDay()];
	}else{
		return thaiDate(t);
	}
}
function thaiDate(t){
	var isDate = new Date(t);
	return day[isDate.getDay()]+' ที่ '+isDate.getDate()+' '+month[isDate.getMonth()]+' '+(isDate.getFullYear()+543);
	//new Date(t).toString().replace(/GMT.*/,'');
}
function Debug(msg){
	if(isDebug){
		console.log(msg);
	}
}
function addBadge(count){
	count = (typeof count!='number')?1:count;
	chrome.browserAction.getBadgeText({},function(badge){
		badge = isNaN(parseInt(badge))?0:parseInt(badge);
		chrome.browserAction.setBadgeText({text:(badge+count).toString()});
	});
}
function clearBadge(){
	chrome.browserAction.setBadgeText({
		text: ''
	});
}

function createNotification(data){
	if(data.icon==undefined){data.icon="images/icon128.png";}
	if(data.title==undefined){data.title="";}
	if(data.desc==undefined){data.desc="";}
	if(data.url==undefined){data.url="";}
	if(data.type==undefined||data.type==""){data.type="default";}
	
	var desc = "";
	for(i=0;i<Math.ceil(data.desc.length/10);i++){
		desc =desc+data.desc.substr(i*10,10)+"\t";
	}
	data.desc = desc;
	delete desc;
	
	if(data.type!='default'){
		createNotificationByType(data);
		return true;
	}
	var noti = window.webkitNotifications.createNotification(data.icon, data.title, data.desc);

	Debug(noti);
	noti.tag = data.type;
	noti.onclose = function(){
		Debug(this);
	}
	if(typeof data.click=="function"){
		noti.onclick = function(){
			data.click(data.url);
			noti.close();
		};
	}
	noti.onshow = function(){
		setTimeout(function(){
			noti = notification.shift();
			noti.close();
			delete(noti);
		},notificationTimeout);
	};
	noti.show();
	notification.push(noti);
}

function createNotificationByType(data){	
	chrome.notifications.create("edtguide-"+data.id,{
		type:data.type,
		title:data.title,
		message:data.desc,
		iconUrl:data.icon,
		imageUrl:data.img
	},function(id){
		notifications[0].timeout = setTimeout(function(){
			chrome.notifications.clear(id,function(){});
		},9000);
	});
}

