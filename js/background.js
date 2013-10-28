var notificationUrl = 'https://secure.soi19.com/notification/register.php';

chrome.runtime.onInstalled.addListener(function(obj){
	Debug("Installed");
	createDatabase();
	//createNotification({icon:"images/icon128.png",title:"Welcome Edtguide Notification"});
	var t = new Date().getTime();



	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"http://ed.files-media.com/di/logo.png\",\"title\":\"รวมมิตร..ที่กิน เที่ยวใกล้กรุงเทพ\",\"desc\":\"วันหยุด..แต่ไม่รู้จะไปเที่ยวไหน?  แถมอยากเที่ยวใกล้ๆ เราคัดสรรมาให้เลือกแล้วที่นี่\",\"url\":\"http://bit.ly/19pyCzK\",\"img\":\"https://fbexternal-a.akamaihd.net/safe_image.php?d=AQAYdgSguOlUQlCs&w=377&h=197&url=https%3A%2F%2Ffbcdn-sphotos-e-a.akamaihd.net%2Fhphotos-ak-frc3%2F1384338_10151949793572661_690325411_n.jpg&cfs=1\",\"id\":1381038419829}',"+t+",'http://bit.ly/19pyCzK','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"\",\"title\":\"10 ร้านบุฟเฟ่ต์สไตล์ญี่ปุ่น...อิ่มไม่อั้น ราคาสุดคุ้ม\",\"desc\":\"แต่ละร้านที่คัดมาเรียกว่า ราคา กับ คุณภาพ แบบคุ้มค่าสุดๆเลย อีกทั้งบรรยากาศก็ดีด้วย\",\"url\":\"http://goo.gl/9zqKL4\",\"img\":\"http://ed.files-media.com/ud/images/1/137/408630/IMG_5120-Cover-620x392.jpg\",\"id\":1381038802039}',"+t+",'http://goo.gl/9zqKL4','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"\",\"title\":\"รวมที่พักวิวพาโนราม่า..สุดว้าว!\",\"desc\":\"พาคนรักไปพักผ่อน..จัดให้ประทับใจสุดๆต้องแบบนี้เลย\",\"url\":\"http://goo.gl/rd6Yv2\",\"img\":\"http://ed.files-media.com/ud/images/1/135/403852/cover-600x400.jpg\",\"id\":1381038921052}',"+t+",'http://goo.gl/rd6Yv2','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"images/icon128.png\",\"title\":\"10 ร้านอาหารอร่อย ริมแม่น้ำเจ้าพระยา\",\"desc\":\"เราคัดแต่ร้านวิวดีริมแม่น้ำ แถมแต่ละร้านอาหารอร่อยๆ เรียกว่าไปคุ้มค่าแน่นอนเลยค่ะ\",\"url\":\"http://bit.ly/17UgCiO\",\"img\":\"http://ed.files-media.com/ud/images/1/136/405918/River_Bar_Cafe-620x392.jpg\",\"id\":1381039123830}',"+t+",'http://bit.ly/17UgCiO','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'newreview','{\"type\":\"newreview\",\"icon\":\"images/icon128.png\",\"title\":\"10 ที่พักสไตล์น่ารักๆ\",\"desc\":\"หาที่พักเก๋ๆ น่ารักๆ..มีมุมถ่ายรูปเยอะๆ เพื่อนเห็นแล้วอิจฉา ที่นี่มีครบเลยจ้า\",\"url\":\"http://goo.gl/7ceaea\",\"img\":\"http://ed.files-media.com/ud/images/1/135/403525/Green-600x399.jpg\",\"id\":1381039123830}',"+t+",'http://goo.gl/7ceaea','false')");


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
			console.log(resp);
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
		e = notifications[0];
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