// couchbase_views.js

/**** Dev Design document name : _design/dev_component/
	  Production Design document name : _design/component ****/


// View name v_all_components
function (doc, meta) {
  if (meta.type == "json" && doc.lang && doc.type && (doc.published || doc.published == false)) {
    emit([doc.lang, doc.type], null);
  }
}

// View name v_component
function (doc, meta) {
  if (meta.type == "json" && doc.lang && doc.type && (doc.published || doc.published == false)) {
    emit([doc.lang, doc.type, doc.published], null);
  }
}

// View name v_templates
function (doc, meta) {
  if (meta.type == "json" && doc.lang && doc.type && (doc.published || doc.published == false)) {
    emit(doc.lang, null);
  }
}