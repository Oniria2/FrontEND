# Installation des librairies

Pour commencer à travailler sur ce projet il faut dans un premier temps installer toute les dépendances nécessaires au projet. <br />
Veuillez exécuter cette commande dans votre terminal : `npm install --force`.

## Les commandes git 

Pour cloner le projet pour le récupérer en local il faut éxecuter la commande suivante : 
 git clone <ssh-du-repository> ou git clone <url-du-repository>

Pout Ajouter les modifications il faut éxecuter la commande suivante : 
 git add .

Pour créer un commit il faut éxecuter la commande suivante : 
 git commit -m "Votre message de commit qui dit explicitement ce que le commit fait"

Pour envoyer le code sur github il faut éxecuter la commande suivante : 
 git push 

## Les bonnes pratiques de code 

Les bonnes pratiques de code a appliquer obligatoirement a ce projet :
   - Créer une branche sur laquelle travailler et ne pas coder directement sur la branche main
   - Le nom de la branche doit étre en rapport avec la tache a effectué
   - Faire plusieurs commit et push et ne pas faire un gros push a la fin
   - Lors de la merge request il faut mettre le label review , s'assigné , mettre l'issue ,  et ajouter un reviewer autre que soit
   - Il ne faut pas forcer le merge de la merge request et attendre que le reviewer le fasse

## Démarrer l'application

Pour démarrer l'application sur le téléphone il faut lancer la commande suivante : ` npm start`.

## Bien commencer avec React Native 

Lien vers la documentation :  [Documentation](https://reactnative.dev/docs/environment-setup). 
 
## Outils pour lancer l'application ( au choix )

- Installer l'application Expo Go sur le téléphone pour afficher l'application en local : [Télécharger Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en).

- Installer Android Studio sur l'ordinateur : [Télécharger Android Studio](https://developer.android.com/studio?hl=fr).

## Fonctionnement des workflows

Les workflows se trouvent dans le dossier `.github/workflows`

`eslint.yml` permet de  vérifier automatiquement la syntaxe en utilisant lint et de vérifier que le langage utilisé est du TypeScript.

## Husky

Husky permet d'analyser le code avant d'effectuer un commit en utilisant nos différents script , les checks se trouvent dans .husky/pre-commit . Pour ne pas éxecuter les checks lors du commit , il faut rajouter à la fin du message de commit -n. Pour en savoir plus [Husky documentation](https://typicode.github.io/husky/).

## Dossier ressources (celui en dehors du src)

Ce dossier sert à stocker à un seul endroit toute les ressources que nous trouvons utiles pour notre projet.

## Auteur

[Anthonin Helias](https://github.com/AnthoninHelias). 
