// v_component_couchbase_view.js
function (doc, meta) {
  if (meta.type == "json" && doc.lang && doc.type && (doc.published || doc.published == false)) {
    emit([doc.lang, doc.type, doc.published], null);
  }
}