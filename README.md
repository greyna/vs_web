# vs_web
VS UTC API08 website may 2014

## Informations
Se placer avec le terminal dans le dossier, puis mvn spring-boot:run
Ou bien le jar présent dans le dossier avec java -jar vs-web-alpha.jar

Pour couchbase, on trouvera les vues dans le fichier public/admin/couchbase_views.js . Suivez les commentaires !

Pour tester l'appli, RDV au http://localhost:8080/admin/index.html !

Toutes les urls admin/** et REST sont sécurisées avec le compte "user" de mot de passe "password" par un jsessionid dans les cookies.

Pour modifier le projet ou l'importer dans Spring tool suite, ne récupérer que le pom.xmln et les dossiers public et src dans un nouveau dossier, puis effectuer un import maven project dans eclipse.

## REST API Component
Composant json avec attributs (key, lang, type, published)
 * post /component/{key} pour enregistrer/modifier un composant
 * get /component/{key} pour récupérer un composant
 * delete /component/{key} pour supprimer un composant
 * get /component/{lang}/{type} pour obtenir le composant publié d'une langue et type donnés
 * get /listComponents/{lang}/{type} pour obtenir la liste de tous les composants : "[ {json_compo1}, {json _compo2}]"
 * get /listTemplates pour obtenir la liste de tous les templates

## REST FILE UPLOAD
Il faut typer le fichier, et on peut le mettre dans un dossier en mettant son nom par exemple à img/nom.jpg
 * get /admin/upload_test.html pour le formulaire + script ajax
 * post /upload avec autant de <input name="name"> et <input name="file"> du formdata que de files
 * delete /upload/{name}

## REST PAGE PUBLISHING
Il faut typer dans le nom de la page avec un .html par exemple
 * post /page/{name} avec la page directement dans le body de la requête
 * delete /page/{name}

