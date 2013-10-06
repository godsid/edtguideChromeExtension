var notificationUrl = 'https://secure.soi19.com/notification/register.php';

chrome.runtime.onInstalled.addListener(function(obj){
	Debug("Installed");
	createDatabase();
	//createNotification({icon:"images/icon128.png",title:"Welcome Edtguide Notification"});
	var t = new Date().getTime();
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"http://ed.files-media.com/di/logo.png\",\"title\":\"AKA YAKINIKU\",\"desc\":\"AKA อาหารญี่ปุ่นปิ้งย่างคุณภาพความคุ้มค่า\",\"url\":\"http://review.edtguide.com/405793_\",\"img\":\"http://ed.files-media.com/ud/review/1/136/405793/01.jpg\",\"id\":1381038419829}',"+t+",'http://review.edtguide.com/405793_','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"\",\"title\":\"Soi8 red beat\",\"desc\":\"พบกับความสุข จัดเต็มด้วยการแสดงสุดอลังการที่ Soi8 red beat\",\"url\":\"http://review.edtguide.com/406017_\",\"img\":\"http://ed.files-media.com/ud/review/1/136/406017/Soi8-red-beat01.jpg\",\"id\":1381038802039}',"+t+",'http://review.edtguide.com/406017_','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"\",\"title\":\"ภัตตาคารจีน ฟุ หมาน เหลา\",\"desc\":\"ความอร่อยที่คุ้มค่าคุ้มราคา ต้องมาที่ภัตตาคารจีน ฟุ หมาน เหลา..\",\"url\":\"http://review.edtguide.com/404749_\",\"img\":\"http://ed.files-media.com/ud/review/1/135/404749/Fu-Marn-Lau-280x210.jpg\",\"id\":1381038921052}',"+t+",'http://review.edtguide.com/404749_','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"images/icon128.png\",\"title\":\"ตลาดนัดรถไฟ ศรีนครินทร์\",\"desc\":\"เป็นตลาดกลางคืนที่เอาใจคนที่ชื่นชอบของโบราณ\",\"url\":\"http://review.edtguide.com/399708_\",\"img\":\"http://ed.files-media.com/ud/review/1/134/399708/08.jpg\",\"id\":1381039123830}',"+t+",'http://review.edtguide.com/399708_','false')");

});

chrome.runtime.onUpdateAvailable.addListener(function(obj){
	Debug("Update Version");
});

// Allow notification
if (window.webkitNotifications){
	if (window.webkitNotifications.checkPermission() == 1) { // 0 is PERMISSION_ALLOWED
		window.webkitNotifications.requestPermission();
  }
}
/* Register device*/
var registerDevice = function(){
	Debug("registerDevice");
	chrome.pushMessaging.getChannelId(true,function(ch){
		var name = (typeof localStorage.user=='undefined')?'guest':localStorage.user;
		var email = (typeof localStorage.email=='undefined')?'guest@edtguide.com':localStorage.email;
		Debug("ChannelId: "+ch.channelId+", Name: "+name+", Email: "+email);
		$.post(notificationUrl,{
			"udid":ch.channelId,
			"deviceToken":"not token",
			"appid":3,
			"username":name,
			"type":"chrome",
			"appname":"edtguide",
			"email":email
		});
	});
};
// Push Process
Debug("pushMessaging Listener");
chrome.pushMessaging.onMessage.addListener(pushReceive);
//Received push data
/*function pushReceive(data){
	Debug(data);
	//data.payload
	pushListener();
}*/
registerDevice();
//Received push data
//chrome.pushMessaging.onMessage.addListener(function(data){});
function pushReceive(data){
	Debug("Push Receive");
	addBadge();
	switch(data.subchannelId){
		case 0://with data
			//type|icon|title|desc|url|sound
			data.payload = data.payload.split("|");
			createNotification({
					type:data.payload[0],
					icon:data.payload[1],
					title:data.payload[2],
					desc:data.payload[3],
					url:data.payload[4],
					sound:data.payload[5],
					click:function(resp){
					}
			});
			break;
		case 1://with url
			getPushData(data.payload);
			break;
		case 2:
		case 3:
		default:
			break;
	}
};
function getPushData(url){
	$.get(url,function(resp){
			JSON
			resp.id = new Date().getTime();
			var sql = "INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'"+resp.type+"','"+JSON.stringify(resp)+"',"+resp.id+",'"+resp.url+"','false')";
			resp.type = "image";
			query(sql);
			if(!notifications.length){
				createNotificationByType(resp);
			}
			notifications.push(resp);
	});
};
chrome.notifications.onClicked.addListener(function(id){
		chrome.notifications.clear(id,function(){});
		chrome.tabs.create({url:e.url});
});
chrome.notifications.onClosed.addListener(function(id){
		e = notifications.shift();
		clearTimeout(e.timeout);
		chrome.notifications.clear(id,function(){});
		if(notifications.length){
			createNotificationByType(notifications[0]);
		}
});

//pushReceive({subchannelId :1,payload:"http://srihawong.info/app/chrome/getdata.php"});
//pushReceive({subchannelId :0,payload:"|http://ed.files-media.com/di/logo.png|Review:AKA YAKINIKU|การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกัน...|http://review.edtguide.com/405793_|"})
//pushReceive({type:"url",title:"อิ่มบุญ-อิ่มใจ",desc:"การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกันหน่อย ซึ่งสำหรับเราแล้วชอบที่จะหาร้านอร่อยๆ มีของคุณภาพแบบจัดเต็ม ในบรรยากาศที่ชวนให้รู้สึกครื้นเครง"});
//pushReceive({icon:"http://ed.files-media.com/di/logo.png",title:"อิ่มบุญ-อิ่มใจ",desc:"การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกันหน่อย ซึ่งสำหรับเราแล้วชอบที่จะหาร้านอร่อยๆ มีของคุณภาพแบบจัดเต็ม ในบรรยากาศที่ชวนให้รู้สึกครื้นเครง"});