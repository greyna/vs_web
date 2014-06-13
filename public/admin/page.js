// page.js

// component on which every util.js procedures can perform
function Page(){

	var that = this;

	that.key = ""; // string
	that.newkey = function() { that.key = jq.now() + Math.random().toString(36).substr(2); }

	that.newkey();

	that.type = "page"; 
	that.release; //string
	that.published = false; //bool
	that.lang = "en"; //string
	that.body = "Insérer contenu ici"; //string
	that.templatetype; // type du template
	that.name;



	that.getHtml = function( menu, template ) {
		var context = new Object();

		context.menu = menu;
		context.page = that;

		var templatePage = Handlebars.compile(template.html);
		var html = templatePage(context);
		return html;
	};

	that.publishToServer = function( callback ) {
		that.published = true;
		saveComponent(that, function(){});

		template = new Template();
		menu = new Menu();

		template.type = that.templatetype;
		menu.lang = that.lang;

		getPublishedComponent(template, function() {
			getPublishedComponent(menu, function() {
				deployHtml(that.getHtml(menu, template), that.name+".html");
				if (callback!==undefined) callback();
			}, function(){});
		}, function(){});

		
	}

	that.to_json = function(){
		var json = new Object();
		json.key = that.key;
		json.type = that.type;
		json.release = that.release;
		json.published = that.published;
		json.lang = that.lang;
		json.body = that.body;
		json.templatetype = that.templatetype;
		json.name = that.name;
		return json;
	}

	that.from_json = function(json) {		
		that.key = json.key;
		that.type = json.type;
		that.release = json.release;
		that.published = json.published;
		that.lang = json.lang;
		that.body = json.body;
		that.templatetype = json.templatetype;
		that.name = json.name;
	}

	that.clone = function() {
		var t = new Page();

		t.key = that.key;
		t.type = that.type;
		t.release = that.release;
		t.published = that.published;
		t.lang = that.lang;
		t.body = that.body;
		t.templatetype = that.templatetype;
		t.name = that.name;

		return t;
	};
}	