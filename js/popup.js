var db = openDatabase('notificationDB', '1.0', 'notification Database', 2 * 1024 * 1024);//2M
var isLogin = false;
/*var wwwurl = "http://www.janbin.com";
var authurl = "http://www.janbin.com/users/auth";
var reviewUrl = "http://www.janbin.com/รีวิว";
var avatarUrl = 'http://www.janbin.com/farm/avatar_org';
var staticUrl = 'http://ja.files-media.com/image';
*/
var debug = false;

/* Google Analytics */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-18384901-14']);
_gaq.push(['_trackPageview','/ext/popup.html']);

if(localStorage.debug!=undefined&&localStorage.debug=='true'){
	debug = true;
}

/*
function randerLogin(){
	$('.login').show();
	$('.login .btn-submit').click(function(){
		chrome.tabs.create({url:'http://www.janbin.com/users/auth/login'});
	});
	$('.login a').click(function(){
		var thislink = $(this).attr('href');
		chrome.tabs.query({url:authurl+'*'},function(respArr){	
			if(respArr.length){
				chrome.tabs.update(respArr[0].id,{active:true,url:thislink});
			}else{
				chrome.tabs.create({url:thislink});
			}
		});
	});
}
*/
function randerNotificationNewReview(item,newnode){
	Debug('randerNotificationNewReview');
	var data = JSON.parse(item.data);
	$(newnode).find('a:first').attr('href',data.url);
	$(newnode).find('.txt-red').html('Reciew: '+data.title);
	$(newnode).find('small').html(data.desc);
	$(newnode).find('.thb-action img:first').attr('src',data.img);
	$(newnode).find('figcaption').html('@'+data.title);
	$(newnode).find('abbr').html(justTime(item.time));
	if(item.reading=='true'){
		$(newnode).removeClass('reading');
	}
	return newnode;
}
function randerNotification(items){
	if(debug){
		Debug('rander Notification');
	}
	var template = $('.notification li:first').clone();
	$('.notification').html('');
	
	for(var i=0;i<items.length;i++){
		var item = items.item(i);
		var newnode = $(template).clone();
		switch(item.type){
			case 'newreview':
				newnode = randerNotificationNewReview(item,newnode);
				break;
			default:
				break;
		}
		$(newnode).appendTo('.notification');
	}
	delete newnode;
	delete template;
	delete item;
	delete who;
	delete at;
	$('.notification li a').click(function(){
		chrome.tabs.create({url:$(this).attr('href')});
	});
}
function getNotification(){
	query("SELECT * FROM notification WHERE type IN ('newreview')  ORDER BY  reading ASC ,time DESC LIMIT 0,5 ",function(resp){
		if(resp.rows.length>0){
			$('.notification').hide();
			randerNotification(resp.rows);
			$('.notification').show();
			$('.notification .list').mouseover(function(){
				$(this).addClass('over');
			});
			$('.notification .list').mouseout(function(){
				$(this).removeClass('over');
			});
			
			$('.notification .list').click(function(e){
				_gaq.push(['_trackEvent','popup_review','clicked']);
				
				chrome.tabs.create({url:$(this).find('.detail a:first').attr('href')});
			});
		}else{
			//chrome.tabs.create({url:wwwurl});
			//window.close();
		}
	});
	query("UPDATE notification SET reading = 'true'");
	chrome.browserAction.setBadgeText({
		text: ''
	});
	localStorage.badge = 0;
}
getNotification();

$('.header a').click(function(){
	chrome.tabs.create({url:$(this).attr('href')});
});


setTimeout(function(){
	(function() {
	  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	  ga.src = 'https://ssl.google-analytics.com/ga.js';
	  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
},2000);


/*
// Check Login
chrome.cookies.get({url :wwwurl,name:'WCC_user'},function(cookie){
	if(cookie==null){
		isLogin = false;
		randerLogin();
	}else{
		isLogin = true;
		getNotification();
	}
});
*/