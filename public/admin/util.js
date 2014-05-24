// util.js

var tis = this;

// uses key of argument component
publishComponent = function(component, callback) {
	component.published = true;
	jq.ajax({
		url : 'http://localhost:8080/component/' + component.key,
		type : 'POST',
		dataType : 'text',
		data : JSON.stringify(component.to_json()),
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			console.log("publishComponent réussi");
			callback();
		},
		error : function(msg) {
			console.log("publishComponent raté");
		}
	});
}

// uses key of argument component
saveComponent = function(component, callback) {
	component.newkey();
	component.published = false;
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
function getPublishedComponent(component, callback) {
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
			callback();
		},
		error : function(msg) {
			console.log("getPublishedComponent raté");
		}
	});
}

// string classe_js_component doit avoir exactement le nom de votre classe js (par exemple "Menu" ou "Template")
getUnpublishedComponents = function(liste, lang, type, classe_js_component, callback) {
	jq.ajax({
		url : 'http://localhost:8080/listComponents/' + lang + '/' + type,
		type : 'GET',
		dataType : 'text',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {

			l = JSON.parse(msg);
			console.log(""+l.length);
			for (var i = 0; i < l.length; i++) {
				compo = new tis[classe_js_component];
				compo.from_json(l[i]);
			    liste.push(compo);
			}
			console.log("getUnpublishedComponents réussi");
			callback();
		},
		error : function(msg) {
			console.log("getUnpublishedComponents raté");
		}
	});
}