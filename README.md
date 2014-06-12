# vs_web
Backend website (CMS, wysiwyg) built by Arthur Van Ceulen for VirtualSensitive.

## Admin
 * /admin redirige sur /admin/page.html
 * /admin/page.html pour la gestion des pages
 * /admin/template.html pour la gestion des templates
 * /admin/menu.html pour la gestion du menu
 * /admin/upload.html pour l'upload (sera intégré dans toutes les pages)

## Branche arthur_dev
Je fais mon dev en local sur ma machine, lorsqu'on merge avec la branche master faire attention à :
 * remettre 9292 pour le port de src/main/resources/application.properties
 * remettre un mot de passe pour admin ligne 87 de src/main/java/virtualsensitive/VirtualSensitiveController.java (méthode configure de la classe interne ApplicationSecurity)
 * remettre la vs_url à "http://virtualsensitive.com:9292/" de public/admin/util.js ligne 3

## DEV : install infos
 * Installer git et maven.
 * Récupérer le projet de github avec un *git clone https://github.com/greyna/vs_web.git*.
 * Installer couchbase avec le bucket default, configuré par défaut sur 127.0.0.1:8091. Lancer couchbase comme un service.
 * Créer et publier les vues selon les commentaires et données du fichier public/admin/couchbase_views.js.
 * Se placer avec le terminal dans le dossier vs_web créé par git, puis lancer *mvn spring-boot:run* en tant que service.

Pour modifier le projet ou l'importer dans Spring tool suite, ne récupérer que le pom.xml et les dossiers public et src dans un nouveau dossier, puis effectuer un import maven project dans eclipse.

## DEV : REST API Component
Composant json avec attributs (key, lang, type, published)
 * post /component/{key} pour enregistrer/modifier un composant
 * get /component/{key} pour récupérer un composant
 * delete /component/{key} pour supprimer un composant
 * get /component/{lang}/{type} pour obtenir le composant publié d'une langue et type donnés
 * get /listComponents/{lang}/{type} pour obtenir la liste json de tous les composant selon langue et type donné
 * get /listComponentsByType/{type} pour obtenir la liste json de tous les composants selon type donné
 * get /listTemplates pour obtenir la liste de tous les templates

## DEV : REST FILE UPLOAD
Il faut typer le fichier, et on peut le mettre dans des dossiers automatiquement créés en mettant son nom par exemple à img/nom.jpg
 * post /upload avec autant de <input name="name"> et <input name="file"> du formdata que de files
 * delete /upload/{name}

## DEV : REST PAGE PUBLISHING
Il faut typer dans le nom de la page avec un .html par exemple
 * post /page/{name} avec la page directement dans le body de la requête
 * delete /page/{name}