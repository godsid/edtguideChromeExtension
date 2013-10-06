function onDBError(tx,e){
	Debug("Database Error: "+e.message);
}
function query(sql,callback){
	Debug('Query: '+sql);
	db.transaction(function (tx) {
		tx.executeSql(sql,[],function(tx,rs){
			Debug(rs.row);
			if(callback!=undefined){
				callback(rs);
			}
		},onDBError);
	});
}

/* Create Database if exits */
function createDatabase(){
	query("DROP TABLE notification");
	//Debug('Create Database Table notification');
	query('CREATE TABLE IF NOT EXISTS notification (id integer primary key asc ,type string,data string, time integer, url string ,reading bool)');
	query("INSERT INTO notification VALUES(1,'welcome','data',"+Math.ceil(new Date().getTime()/1000)+",'http://www.edtguide.com','false')");
}

var transaction = {id:null};
var db = openDatabase('notificationDB', '1.0', 'notification Database', 2 * 1024 * 1024);//2M