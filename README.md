# Installation des librairies

Pour commencer à travailler sur ce projet il faut dans un premier temps installer toute les dépendances nécessaires au projet. <br />
Veuillez exécuter cette commande dans votre terminal : `npm install --force`.

## Licence
Ce projet est soumis à une **licence restrictive personnalisée**. Toute utilisation, distribution ou modification sans l'autorisation écrite d'AnthoninHelias est strictement interdite.  
Voir [LICENSE.txt](./LICENSE.txt) pour plus de détails.

## Les commandes git 

Pour cloner le projet pour le récupérer en local il faut éxecuter la commande suivante :  <br />
`git clone <ssh-du-repository> ou git clone <url-du-repository>`

Pout Ajouter les modifications il faut éxecuter la commande suivante :  <br />
`git add .`

Pour créer un commit il faut éxecuter la commande suivante :  <br />
`git commit -m "Votre message de commit qui dit explicitement ce que le commit fait en anglais"`

Pour envoyer le code sur github il faut éxecuter la commande suivante :  <br />
`git push` 

## Les bonnes pratiques de code 

Les bonnes pratiques de code a appliquer obligatoirement a ce projet :
   - Créer une branche sur laquelle travailler et ne pas coder directement sur la branche `main`
   - Le nom de la branche doit étre en rapport avec la tache a effectué
   - Faire plusieurs commit et push et ne pas faire un gros push a la fin
   - Lors de la merge request il faut mettre le label **review** , s'assigné , mettre l'issue ,  et ajouter un reviewer autre que soit
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

Husky permet d'analyser le code avant d'effectuer un commit en utilisant nos différents script , les checks se trouvent dans .husky/pre-commit . Pour ne pas éxecuter les checks lors du commit , il faut rajouter après le message de commit `-n`. Pour en savoir plus [Husky documentation](https://typicode.github.io/husky/).

## Dossier ressources (celui en dehors du src)

Ce dossier sert à stocker à un seul endroit toute les ressources que nous trouvons utiles pour notre projet.

## Auteur

[Anthonin Helias](https://github.com/AnthoninHelias). 




# Library Installation

To start working on this project, you first need to install all the necessary dependencies.  
Please run the following command in your terminal:  
`npm install --force`.

## Git Commands

To clone the project and retrieve it locally, execute the following command:  
`git clone <ssh-repository-url>` or `git clone <repository-url>`

To add modifications, execute the following command:  
`git add .`

To create a commit, execute the following command:  
`git commit -m "Your commit message clearly stating what the commit does in English"`

To push the code to GitHub, execute the following command:  
`git push`

## Best Coding Practices

The best coding practices that must be applied to this project:  
   - Create a branch to work on instead of coding directly on the `main` branch.  
   - The branch name should be related to the task being performed.  
   - Make multiple commits and pushes instead of a single large push at the end.  
   - When making a merge request, add the **review** label, assign yourself, link the issue, and add a reviewer other than yourself.  
   - Do not force merge a merge request; wait for the reviewer to do it.  

## Starting the Application

To start the application on your phone, run the following command:  
`npm start`.

## Getting Started with React Native  

Documentation link: [React Native Documentation](https://reactnative.dev/docs/environment-setup).

## Tools to Run the Application (Choose One)

- Install the **Expo Go** application on your phone to display the application locally:  
  [Download Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en).  

- Install **Android Studio** on your computer:  
  [Download Android Studio](https://developer.android.com/studio?hl=en).  

## Workflow Operations

The workflows are located in the `.github/workflows` folder.

- `eslint.yml` automatically checks the syntax using lint and ensures that the language used is TypeScript.

## Husky

Husky analyzes the code before committing using our different scripts. The checks are located in `.husky/pre-commit`.  
To skip these checks when committing, add `-n` the commit message.  
For more information, visit the [Husky documentation](https://typicode.github.io/husky/).

## Resources Folder (Outside the `src` Folder)

This folder is used to store all the useful resources for our project in one place.

## License
This project is under a **custom restrictive license**. Any use, distribution, or modification without written permission from AnthoninHelias is strictly prohibited.
See [LICENSE.txt](./LICENSE.txt) for details.

## Author

[Anthonin Helias](https://github.com/AnthoninHelias).

