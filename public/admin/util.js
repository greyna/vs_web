// util.js

var tis = this;

// Paramètres GET de l'url (vs.com?param1=1 will return "param1=1")
function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// uses key of argument component
saveComponent = function(component, callback) {
	jq.ajax({
		url : 'http://localhost:8080/component/' + component.key,
		type : 'POST',
		dataType : 'text',
		data : JSON.stringify(component.to_json()),
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			console.log("saveComponent réussi");
			callback();
		},
		error : function(msg) {
			console.log("saveComponent raté");
		}
	});
}

// uses key of argument component
getComponent = function(component, callback) {
	jq.ajax({
		url : 'http://localhost:8080/component/' + component.key,
		type : 'GET',
		dataType : 'text',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			console.log("getComponent réussi");
			component.from_json(JSON.parse(msg));
			callback();
		},
		error : function(msg) {
			console.log("getComponent raté");
		}
	});
}

// uses key of argument component
deleteComponent = function(component, callback) {
	jq.ajax({
		url : 'http://localhost:8080/component/' + component.key,
		type : 'DELETE',
		dataType : 'text',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			console.log("deleteComponent réussi");
			callback();
		},
		error : function(msg) {
			console.log("deleteComponent raté");
		}
	});
}

// uses lang and type of argument component
function getPublishedComponent(component, success_callback, failure_callback) {
	jq.ajax({
		url : 'http://localhost:8080/component/' + component.lang + '/' + component.type,
		type : 'GET',
		dataType : 'text',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			console.log("getPublishedComponent réussi");
			component.from_json(JSON.parse(msg));
			success_callback();
		},
		error : function(msg) {
			console.log("getPublishedComponent raté");
			failure_callback();
		}
	});
}

// string classe_js_component doit avoir exactement le nom de votre classe js (par exemple "Menu" ou "Template")
getAllComponents = function(liste, lang, type, classe_js_component, callback) {
	jq.ajax({
		url : 'http://localhost:8080/listComponents/' + lang + '/' + type,
		type : 'GET',
		dataType : 'text',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {

			l = JSON.parse(msg);
			for (var i = 0; i < l.length; i++) {
				compo = new tis[classe_js_component];
				compo.from_json(l[i]);
			    liste.push(compo);
			}
			console.log("getAllComponents réussi");
			callback();
		},
		error : function(msg) {
			console.log("getAllComponents raté");
		}
	});
}

// string classe_js_component doit avoir exactement le nom de votre classe js (par exemple "Menu" ou "Template")
getTemplates = function(liste, callback) {
	jq.ajax({
		url : 'http://localhost:8080/listTemplates',
		type : 'GET',
		dataType : 'text',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {

			l = JSON.parse(msg);
			for (var i = 0; i < l.length; i++) {
				compo = new tis['Template'];
				compo.from_json(l[i]);
			    liste.push(compo);
			}
			console.log("getTemplates réussi");
			callback();
		},
		error : function(msg) {
			console.log("getTemplates raté");
		}
	});
}

deployHtml = function(html, name) {
	jq.ajax({
		url : 'http://localhost:8080/page/' + name,
		type : 'POST',
		dataType : 'text',
		data : html,
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			console.log("deployHtml réussi : "+msg);
		},
		error : function(msg) {
			console.log("deployHtml raté : "+msg);
		}
	});
}