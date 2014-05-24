// template_ui.js
// var ui_test = jq('#test');

function Template_ui() {

	var that = this;
	
	that.currentTemplate = new Template();
	that.load = function() {

		var l_template = [];
		getTemplates(l_template, function(){
			for (var i = 0; i < l_template.length; i++) {
				that.add_type(l_template[i].type);
			}

			that.currentTemplate.type = "menu";
			getPublishedComponent(that.currentTemplate, that.renderTemplate);
		});

		// Test de getAllComponents pour le menu de Thomas
		var l_menu = [];
		getAllComponents(l_menu, "en", "menu", "Menu", function(){
			var ui_test = jq('#test');
			ui_test.append("Voilà tous les menus :<br/>");
			for (var i = 0; i < l_menu.length; i++) {
				ui_test.append(""+ l_menu[i].type +" avec "+l_menu[i].children.length+" children. Key : "+l_menu[i].key+"<br/>");
			}
		});

		// Exemple de récupération de menu pour Bruno
		var menu = new Menu();
		menu.lang = 'en';
		menu.type = 'menu';
		getPublishedComponent(menu, function(){
			var ui_test = jq('#test2');
			ui_test.append("Voilà le Menu (lang=en, type=menu, published=true) de la BDD :<br/>");
			ui_test.append("Item 0 : " + menu.children[0]);
			ui_test.append("Item 1 : " + menu.children[1]);
			ui_test.append("Sous-item 0 de l'Item 1 : " + menu.children[1].children[0]);
		});
	}

	that.ui_template = jq('#template');
	that.ui_save = jq('#save');
	that.ui_publish = jq('#publish');
	that.ui_delete = jq('#delete');
	that.ui_txt_type = jq('#txt_type');
	that.ui_lst_type = jq('#lst_type');
	that.ui_add_type = jq('#add_type');

	that.renderTemplate = function() {
		that.add_type(that.currentTemplate.type);
		that.ui_template.val(that.currentTemplate.html);
	}

	that.add_type = function(txt) {
		if (jq("#" + txt).length == 0) {
			that.ui_lst_type.append("<option id='" + txt + "' value='" + txt + "'>" + txt + "</option>");
		}
		that.ui_lst_type.val(that.currentTemplate.type);
	}

	that.ui_add_type.click(function (e){
		var txt = that.ui_txt_type.val();
		that.add_type(txt);
		that.currentTemplate.type = txt;
		that.currentTemplate.newkey();
		that.renderTemplate();
	});

	that.ui_lst_type.change(function (e){
		that.currentTemplate.type = that.ui_lst_type.val();
		getPublishedComponent(that.currentTemplate, that.renderTemplate);
	});

	that.ui_save.click(function(e) {
		saveComponent(that.currentTemplate, function(){});
	});

	that.ui_delete.click(function(e) {
		deleteComponent(that.currentTemplate, function(){});
	});

	that.ui_publish.click(function (e){
		that.currentTemplate.html = that.ui_template.val();
		publishComponent(that.currentTemplate, function(){});
	});
}
