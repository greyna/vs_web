// template_ui.js
// var ui_test = jq('#test');

function Template_ui() {

	var that = this;
	
	that.currentTemplate = new Template();
	that.lst_all_templates = [];

	that.ui_template = jq('#template');
	that.ui_save = jq('#save');
	that.ui_publish = jq('#publish');
	that.ui_delete = jq('#delete');
	that.ui_txt_type = jq('#txt_type');
	that.ui_lst_type = jq('#lst_type');
	that.ui_add_type = jq('#add_type');
	that.ui_pub = jq('#pub');
	that.ui_lst_release = jq("#lst_release");
	that.ui_new_version = jq('#new_version');

	// that.OLDload = function() {

	// 	that.load(function(){

	// 		that.currentTemplate.type = "menu";
	// 		getPublishedComponent(that.currentTemplate, that.renderTemplate);
	// 	});

	// 	// Test de getAllComponents pour le menu de Thomas
	// 	var l_menu = [];
	// 	getAllComponents(l_menu, "en", "menu", "Menu", function(){
	// 		var ui_test = jq('#test');
	// 		ui_test.append("Voilà tous les menus :<br/>");
	// 		for (var i = 0; i < l_menu.length; i++) {
	// 			ui_test.append(""+ l_menu[i].type +" avec "+l_menu[i].children.length+" children. Key : "+l_menu[i].key+"<br/>");
	// 		}
	// 	});

	// 	// Exemple de récupération de menu pour Bruno
	// 	var menu = new Menu();
	// 	menu.lang = 'en';
	// 	menu.type = 'menu';
	// 	getPublishedComponent(menu, function(){
	// 		var ui_test = jq('#test2');
	// 		ui_test.append("Voilà le Menu (lang=en, type=menu, published=true) de la BDD :<br/>");
	// 		ui_test.append("Item 0 : " + menu.children[0].txt+"<br/>");
	// 		ui_test.append("Item 1 : " + menu.children[1].txt+"<br/>");
	// 		ui_test.append("Sous-item 0 de l'Item 1 : " + menu.children[1].children[0].txt+"<br/>");
	// 	});
	// };

	that.load = function(callback) {
		getTemplates(that.lst_all_templates, function(){
			that.ui_lst_release.html('<option id="lst_release_choisir" value="lst_release_choisir">Choisir...</option>');
			that.ui_lst_release.val("lst_release_choisir");

			for (var i = 0; i < that.lst_all_templates.length; i++) {
				that.add_type(that.lst_all_templates[i].type);
			}

			callback();
		});
	};



	that.renderTemplate = function() {
		that.ui_template.val(that.currentTemplate.html);

		that.add_type(that.currentTemplate.type);
		that.ui_lst_type.val(that.currentTemplate.type);

		that.add_release(that.currentTemplate.release);
		that.ui_lst_release.val(that.currentTemplate.release);

		if (that.currentTemplate.published)
			that.ui_pub.html("PUBLIÉ");
		else 
			that.ui_pub.html("NON PUBLIÉ");
	};

	that.findTemplate = function(type, release) {
		for (var i = 0; i < that.lst_all_templates.length; i++) {
			t = that.lst_all_templates[i];
			if (t.type === type) {
				if (t.release === release) {
					return i;
				}
			}
		}
		return -1;
	};
	that.updateTemplateInList = function(template) {
		var i = that.findTemplate(template.type, template.release);
		if (i>=0)
			that.lst_all_templates[i] = template.clone();
	}

	that.new_template = function() {
		that.currentTemplate.newkey();
		that.currentTemplate.published = false;
		that.currentTemplate.html = "";

		var new_release = 1;

		for (var i = 0; i < that.lst_all_templates.length; i++) {
			if (that.lst_all_templates[i].type === that.currentTemplate.type) {
				if (parseInt(that.lst_all_templates[i].release, 10) >= new_release) {
					new_release = parseInt(that.lst_all_templates[i].release, 10) + 1;
				}
			}
		}

		new_release += '';
		that.currentTemplate.release = new_release;
		that.lst_all_templates.push(that.currentTemplate.clone());
		that.renderTemplate();
	};


	that.add_type = function(txt) {
		if (jq("#" + txt).length === 0) {
			that.ui_lst_type.append("<option id='" + txt + "' value='" + txt + "'>" + txt + "</option>");
		}
	};

	that.add_release = function(txt) {
		if (jq("#" + txt).length === 0) {
			that.ui_lst_release.append("<option id='" + txt + "' value='" + txt + "'>" + txt + "</option>");
		}
	};

	that.build_lst_release = function() {
		that.ui_lst_release.html('<option id="lst_release_choisir" value="lst_release_choisir">Choisir...</option>');
		that.ui_lst_release.val("lst_release_choisir");

		for (var i = 0; i < that.lst_all_templates.length; i++) {
			if (that.lst_all_templates[i].type === that.currentTemplate.type) {
				that.add_release(that.lst_all_templates[i].release);
			}
		}
	};



	that.ui_add_type.click(function (e){
		that.currentTemplate.type = that.ui_txt_type.val();
		that.new_template();
		that.build_lst_release();
	});
	that.ui_new_version.click(function (e){
		if (that.ui_lst_type.val() === "lst_type_choisir") return;
		that.new_template();
	});

	that.ui_lst_type.change(function (e){
		if (that.ui_lst_type.val() === "lst_type_choisir") return;

		that.currentTemplate.type = that.ui_lst_type.val();
		that.build_lst_release();
	});

	that.ui_lst_release.change(function (e){
		if (that.ui_lst_release.val() === "lst_release_choisir") return;
		var i = that.findTemplate(that.currentTemplate.type, that.ui_lst_release.val());

		that.currentTemplate = that.lst_all_templates[i].clone();
		that.renderTemplate();
	});

	that.ui_save.click(function (e) {
		if (that.ui_lst_type.val() === "lst_type_choisir" ||
			that.ui_lst_release.val() === "lst_release_choisir") return;

		that.currentTemplate.html = that.ui_template.val();
		that.updateTemplateInList(that.currentTemplate);
		saveComponent(that.currentTemplate, function(){});
	});

	that.ui_delete.click(function (e) {
		if (that.ui_lst_type.val() === "lst_type_choisir" ||
			that.ui_lst_release.val() === "lst_release_choisir") return;
			
		var i = that.findTemplate(that.currentTemplate.type, that.ui_lst_release.val());
		that.lst_all_templates.remove(i);
		that.build_lst_release;
		deleteComponent(that.currentTemplate, function(){});
	});

	that.ui_publish.click(function (e){
		if (that.ui_lst_type.val() === "lst_type_choisir" ||
			that.ui_lst_release.val() === "lst_release_choisir") return;
			
		// suppression de la publication de l'ancien template
		var previousPublished = new Template();
		previousPublished.type = that.currentTemplate.type;
		getPublishedComponent(previousPublished, function(){
			previousPublished.published = false;
			that.updateTemplateInList(previousPublished);
			saveComponent(previousPublished, function(){});
		});

		// enregistrement du nouveau template publié
		that.currentTemplate.published = true;
		that.currentTemplate.html = that.ui_template.val();
		that.updateTemplateInList(that.currentTemplate);
		saveComponent(that.currentTemplate, function(){});
	});
}
