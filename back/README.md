# 🛠️ PreviZen - API Backend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](#)

> Ce dossier contient l'API RESTful de l'application PreviZen, construite avec **Node.js**, **Express** et **MySQL**.

1.  Installez les dépendances :

```sh
npm install
```

2.  **Configuration (.env) :**
    Créez un fichier `.env` à la racine du dossier `back` et renseignez les variables suivantes :

    ```env

    PORT=5000
    NODE_ENV=development # Configuration Base de données
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=votre_mot_de_passe
    DB_NAME=PreviZen
    DB_PORT=votre_port
    DB_DIALECT=mysql # Sécurité
    JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe

    # API Externe
    API_KEY=votre_cle_api_openweathermap

    ```

3.  Lancement du serveur :

```sh
node .\serveur.js
```

_Note : Au premier lancement, Sequelize créera automatiquement les tables dans la base de données._

## Run tests

```sh
npm run test
```

## Author

👤 **Theo Villeneuve**

- Website: Theo Villeneuve
- Github: [@ThOurss](https://github.com/ThOurss)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
