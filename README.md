Luxos request API

node v22.11.0

- créer le dossier public/documents et public/images
- créer un fichier .env en se basant sur le fichier .env.example(renseigner les information de votre base donnés)
- créer un fichier config/config.json se basant sur le fichier sur config/config.example.json (renseigner les information de votre base donnés)
- créer le fichier .env en se basant sur les informations du fichier .example.env et remplir les informations sur la base des données
- `npm install`
- `npx sequelize-cli db:create` créer la BD
- `npx sequelize-cli db:migrate` executer les migrations
- `npx sequelize-cli db:seed:all` executer les seeders
