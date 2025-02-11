# Installation des librairies

Pour commencer à travailler sur ce projet il faut dans un premier temps installer toute les dépendances nécessaires au projet. <br />
Veuillez exécuter cette commande dans votre terminal : `npm install --force`.

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

Husky permet d'analyser le code avant d'effectuer un commit en utilisant nos différents script , les checks se trouvent dans .husky/pre-commit . Pour ne pas éxecuter les checks lors du commit , il faut rajouter à la fin du message de commit -n. Pour en savoir plus Husky documentation.

## Dossier ressources (celui en dehors du src)

Ce dossier sert à stocker à un seul endroit toute les ressources que nous trouvons utiles pour notre projet.

## Auteurs 

[Anthonin Helias](https://github.com/AnthoninHelias). 

