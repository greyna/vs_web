// page_ui.js
// var ui_test = jq('#test');

function PageUi() {

	var that = this;
	
	that.currentPage = new Page();
	that.lst_all_pages = [];
	that.lst_all_templates = [];


	that.ui_pub = jq('#pub');
	that.ui_link_web = jq('#link_web');

	that.ui_nom = jq('#nom_page');
	that.ui_link_edit = jq('#link_edit');

	that.ui_save = jq('#save_page');
	that.ui_delete = jq('#delete_page');

	that.ui_lst_page = jq('#lst_page');
	that.ui_add_page = jq('#add_page');

	that.ui_lst_template = jq('#lst_template');

	that.buildAllPagesAndTemplates = function(callback) {
		getTemplates(that.lst_all_templates, function(){
			for (var i = 0; i < that.lst_all_templates.length; i++) {
				that.add_template(that.lst_all_templates[i].type);
			}
			getAllComponentsByType(that.lst_all_pages, "page", "Page", function(){
				callback();
			});
		});
	};

	that.load = function(callback) {
		that.buildAllPagesAndTemplates(function(){
			that.build_lst_page();
			callback();
		});
	};



	that.renderPage = function() {
		that.ui_nom.val(that.currentPage.name);

		if (that.currentPage.templatetype == undefined) {
			that.ui_lst_template.val("lst_template_choisir");
		} else {
			that.ui_lst_template.val(that.currentPage.templatetype);
		}

		that.add_page(that.currentPage.name);
		that.ui_lst_page.val(that.currentPage.name);

		that.ui_link_web.attr("href", "http://localhost:8080/"+that.currentPage.name+".html");
		that.ui_link_edit.attr("href", "http://localhost:8080/admin/editPage.html?page="+that.currentPage.key);

		if (that.currentPage.published)
			that.ui_pub.html("PUBLIÉ");
		else 
			that.ui_pub.html("NON PUBLIÉ");
	};

	that.findPage = function(name) {
		for (var i = 0; i < that.lst_all_pages.length; i++) {
			t = that.lst_all_pages[i];
			if (t.name === name) {
				return i;
			}
		}
		return -1;
	};
	that.updatePageInList = function(page) {
		for (var i = 0; i < that.lst_all_pages.length; i++) {
			t = that.lst_all_pages[i];
			if (t.key === page.key) {
				that.lst_all_pages[i] = page.clone();
				return;
			}
		}
	}

	that.new_page = function() {
		that.currentPage = new Page();
		that.currentPage.name = "NouvellePage";
		that.add_page(that.currentPage.name);
		that.lst_all_pages.push(that.currentPage.clone());
		that.renderPage();
	};


	that.add_page = function(txt) {
		if (jq("#" + txt).length === 0) {
			that.ui_lst_page.append("<option id='" + txt + "' value='" + txt + "'>" + txt + "</option>");
		}
	};

	that.add_template = function(txt) {
		if (jq("#" + txt).length === 0) {
			that.ui_lst_template.append("<option id='" + txt + "' value='" + txt + "'>" + txt + "</option>");
		}
	};

	that.build_lst_page = function() {
		that.ui_lst_page.html('<option id="lst_page_choisir" value="lst_page_choisir">Choisir...</option>');
		that.ui_lst_page.val("lst_page_choisir");

		for (var i = 0; i < that.lst_all_pages.length; i++) {
			that.add_page(that.lst_all_pages[i].name);
		}
	};

	that.ui_add_page.click(function (e){
		that.new_page();
	});

	that.ui_lst_page.change(function (e){
		if (that.ui_lst_page.val() === "lst_page_choisir") return;

		that.currentPage = that.lst_all_pages[ that.findPage(that.ui_lst_page.val()) ].clone();
		that.renderPage();
	});

	that.ui_lst_template.click(function (e) {
		if (that.ui_lst_template.val() === "lst_template_choisir") return;

		that.currentPage.templatetype = that.ui_lst_template.val();
	});

	that.ui_save.click(function (e) {
		if (that.ui_lst_page.val() === "lst_page_choisir") return;

		that.currentPage.name = that.ui_nom.val();
		that.updatePageInList(that.currentPage);
		that.build_lst_page();
		that.renderPage();
		saveComponent(that.currentPage, function(){});
	});

	that.ui_delete.click(function (e) {
		if (that.ui_lst_page.val() === "lst_page_choisir") return;
		if (that.currentPage.published) return; //TODO afficher pour supprimer il ne doit pas être publié

		var i = that.findPage(that.currentPage.type, that.currentPage.release);
		that.lst_all_pages.remove(i);
		that.build_lst_page();
		deleteComponent(that.currentPage, function(){});
	});
}