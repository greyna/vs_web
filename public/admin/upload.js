//Éviter les conflits entre browsers
var jq = jQuery.noConflict();

var divUp = jq("#divUpload");
var divHe = jq("#divHelp");
//a.html("insert html here");
var btnUp = jq("#btnUpload");
var btnHe = jq("#btnHelp");
btnUp.click(function(){
	if(divUp.is(":visible")){
		divUp.hide();
	} else {
		divUp.show();
	}
});
btnHe.click(function(){
	if(divHe.is(":visible")){
		divHe.hide();
	} else {
		divHe.show();
	}
});

function addUploadField() {
	var newFileIndex = jq('#fileTable tbody').children().length;
    jq('#fileTable tbody').append(
		'<tr>'+
			'<td>Chemin et nom du fichier : <input type="text" id="name'+newFileIndex+'" name="name"/><br /></td>'+
			'<td><br/><input type="file" id="file'+newFileIndex+'" name="file" /></td>'+
		'</tr>');

    jq('#file'+newFileIndex).change(function(e) {
    	var filename = jq('#file'+newFileIndex).val().replace(/.*(\/|\\)/, '');
    	jq('#name'+newFileIndex).val(filename);
    });
}

function uploadFiles() {
	var nbFiles = jq('#fileTable tbody').children().length;
	var data = new FormData();

	for (var i = 0; i < nbFiles; i++) {
		var file = jq('#file'+i)[0].files[0];
		var name = jq('#name'+i).val();

		if (name !== "" && file !== undefined) {
			data.append('file', file);
			data.append('name', name);
		}
	}

	jq.ajax({
	    url: vs_url + 'upload',
	    data: data,
	    cache: false,
	    contentType: false,
	    processData: false,
	    type: 'POST',
	    success: function(msg){
			console.log("upload réussi");
			jq('#result').html(msg);
	    },
		error : function(msg) {
			console.log("upload raté");
			jq('#result').html(msg);
		}
	});
}

addUploadField();
jq('#addFile').click(addUploadField);
jq('#upload').submit(function(e) {
	e.preventDefault();
	uploadFiles();
});