// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/user');
const loginRouter = require('./routes/login');

const app = express();

// Connexion à la base de données MongoDB

//mongodb://root:admin@localhost/mon-projet-casl?authSource=admin&useUnifiedTopology=true
mongoose.connect('mongodb://root:admin@localhost/mon-projet-casl?authSource=admin&useUnifiedTopology=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/articles', articlesRouter);

// Démarrage du serveur
app.listen(3001, () => {
  console.log('Serveur en écoute sur le port 3000');
});
