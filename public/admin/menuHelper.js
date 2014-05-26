// MenuHelper.js

function MenuHelper() {
	var that = this;

	/*TODO
		à chaque création d'un nouveau menu le rajouter à la liste
		à chaque sauvegarde ou publication d'un menu l'update dans la liste
	*/

	// la liste que je t'offre, et qu'il faut maintenir en état à l'aide du TODO
	that.lst_all_menus = [];

	// builder de la liste en async
	that.buildAllMenus = function(callback) {
		getAllComponentsByType(that.lst_all_menus, "menu", "Menu", function(){
			callback();
		});
	};


	// ça te donne immédiatement la valeur d'une nouvelle release (aide pour création/save)
	// utilise l'état de lst_all_menus et donne la nouvelle release pour un menu d'une lang donnée
	// OK TU L'AVAIS DEJA FAIT JE CROIS
	// that.getNewRelease = function(lang) {
	// 	var new_release = 1;

	// 	for (var i = 0; i < that.lst_all_menus.length; i++) {
	// 		var mymenu = that.lst_all_menus[i];
	// 		if (mymenu.lang === lang) {
	// 			// alors mymenu est de la lang souhaité
	// 			if (parseInt(mymenu.release, 10) >= new_release) {
	// 				// alors la release de mymenu est supérieure à la nouvelle release qu'on calcule, ce qui doit être impossible
	// 				new_release = parseInt(mymenu.release, 10) + 1;
	// 			}
	// 		}
	// 	}

	// 	new_release += '';
	// 	return new_release;
	// }

	// renvoit un tableau de toutes les langs de tous les menus
	that.getAllMenuLangs = function() {
		langs = [];

		for (var i = 0; i < that.lst_all_menus.length; i++) {
			if (langs.indexOf(that.lst_all_menus[i].lang) < 0) {
				// alors la lang n'est pas encore dans la liste
				langs.push(that.lst_all_menus[i].lang);
			}
		}

		return langs;
	}

	// renvoit un tableau de toutes les releases de tous les menus d'une lang donnée
	that.getMenuReleasesByLang = function(lang) {
		releases = [];

		for (var i = 0; i < that.lst_all_menus.length; i++) {
			if (that.lst_all_menus[i].lang === lang) {
				// alors ce menu a la lang souhaitée
				if (releases.indexOf(that.lst_all_menus[i].release) < 0) {
					// alors la release n'est pas encore dans la liste
					releases.push(that.lst_all_menus[i].release);
				}
			}
		}

		return releases;
	}
}