// template_ui.js
// var ui_test = jq('#test');

function Template_ui() {

	var that = this;
	
	that.currentTemplate = new Template();
	that.load = function() {
		that.currentTemplate.type = "menu";
		l_template = [];

		getUnpublishedComponents(l_template, that.currentTemplate.lang, that.currentTemplate.type, "Template", function(){
			for (var i = 0; i < l_template.length; i++) {
				that.add_type(l_template[i].type);
			}
			getPublishedComponent(that.currentTemplate, that.renderTemplate);
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

	that.ui_publish.click(function (e){
		that.currentTemplate.html = that.ui_template.val();
		publishComponent(that.currentTemplate, function(){});
	});
}
