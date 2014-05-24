// template.js

function Template(){

	var that = this;

	that.key = "rien"; // string
	that.newkey = function() { that.key = jq.now() + Math.random().toString(36).substr(2); }
	that.newkey();

	that.classname = "Template";
	that.type = "rien"; 
	that.release = "rien"; //string
	that.published = false; //bool
	that.lang = "template"; //string
	that.html = "rien"; //string
	
	that.to_json = function(){
		var json = new Object();
		json.key = that.key;
		json.type = that.type;
		json.release = that.release;
		json.published = that.published;
		json.lang = that.lang;
		json.html = that.html;
		return json;
	}

	that.from_json = function(json) {		
		that.key = json.key;
		that.type = json.type;
		that.release = json.release;
		that.published = json.published;
		that.lang = json.lang;
		that.html = json.html;
	}
	
	that.save = function(callback) {
		jq.ajax({
			url : 'http://localhost:8080/component/' + that.key,
			type : 'POST',
			dataType : 'text',
			data : JSON.stringify(that.to_json()),
			contentType : "application/json; charset=utf-8",
			traditional : true,
			success : function(msg) {
				console.log("Enregistrement template réussi");
				callback();
			},
			error : function(msg) {
				console.log("Erreur lors de l'enregistrement template");
			}
		});
	}

	
	that.publish = function(callback) {
		that.published = true;
		that.save(callback);
	}

	that.getPublished = function(type, callback){
		jq.ajax({
			url : 'http://localhost:8080/component/template/' + type,
			type : 'GET',
			dataType : 'text',
			data : '',
			contentType : "application/json; charset=utf-8",
			traditional : true,
			success : function(msg) {
				console.log("Récupération template publié réussi");
				that.from_json(JSON.parse(msg));
				callback();
			},
			error : function(msg) {
				console.log("Erreur lors de la récupération template publié");
			}
		});
	}




}