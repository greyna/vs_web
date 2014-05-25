// template.js

// component on which every util.js procedures can perform
function Template(){

	var that = this;

	that.key; // string
	that.newkey = function() { that.key = jq.now() + Math.random().toString(36).substr(2); }
	that.newkey();

	that.className = "Template";
	that.type = "rien"; 
	that.release; //string
	that.published = false; //bool
	that.html; //string
	
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
}