// all_pages.js
// Arthur Van Ceulen for VirtualSensitive

function AllPages() {
	var that = this;
	this.l = [];


}


AllPages.prototype.deployAllPublished = function() {
	for (var i = 0; i < this.l.length; i++) {
		if (this.l[i].published === true)
			this.l[i].publishToServer();
	}
}

AllPages.prototype.load = function(callback) {
	getAllComponentsByType(this.l, "page", "Page", function(){
		if (callback!==undefined) callback();
	});
}

AllPages.prototype.findPage = function(name) {
	for (var i = 0; i < this.l.length; i++) {
		t = this.l[i];
		if (t.name === name) {
			return i;
		}
	}
	return -1;
};

AllPages.prototype.updatePageInList = function(page) {
	for (var i = 0; i < this.l.length; i++) {
		t = this.l[i];
		if (t.key === page.key) {
			this.l[i] = page.clone();
			return;
		}
	}
}