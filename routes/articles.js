// routes/articles.js
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

const defineAbilitiesFor = require('../permission/permissions');

router.post('/', auth, async (req, res) => {
  const { user } = req; // Obtenez l'utilisateur actuel depuis votre middleware d'authentification
  const { title, content } = req.body;
  const author = user.userId; // Vous devez déterminer l'auteur de l'article en fonction de votre logique d'authentification
  
  const ability = defineAbilitiesFor(req.user);
  if (ability.can('read', 'Article')) {
    try {
      const article = new Article({ title, content, author });
      await article.save();
      res.send('Article créé avec succès');
    } catch (error) {
      res.status(500).send('Erreur lors de la création de l\'article');
    }
  } else {
    return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à lire cet article' });
  }
});

// Route pour récupérer un article
router.get('/:id', auth, async (req, res) => {
  // Récupérez l'article ici en utilisant l'ID de req.params.id
  const { id } = req.query;

  const ability = defineAbilitiesFor(req.user);
  if (ability.can('read', 'Article')){
    try {
      const article = await Article.findById({_id: id });
  
      if (!article) {
        return res.status(404).send('Article non trouvé');
      }
  
      res.json(article);
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération de l\'article');
    }
  }else {
    return res.status(403).json({ error: "Vous n'êtes pas l'autorisé de lire cet article" });
  }
});


router.put('/:id', auth, async (req, res) => {
  // Récupérez l'article ici en utilisant l'ID de req.params.id
  const { id, title, content } = req.query;

  const article = await Article.findOne({ _id: id });
  
  const ability = defineAbilitiesFor(req.user);
  if (ability.can('update', 'Article')){

    if (!req.user.isAdmin && article.author.toString()  !== req.user.userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à mettre à jour cet article' });
    }

    try {
      Article.updateOne({ _id: id }, {title: title, content: content})
      .then(() => res.status(200).json({message : 'Article modifié!'}))
      .catch((error) => res.status(500).send("Erreur lors de la modification de l'article"));
    } catch (error) {
      res.status(500).send('Erreur lors de la modification de l\'article');
    }
  
  }else {
    return res.status(403).json({ error: "Vous n'êtes pas autorisé à mettre à jour cet article" });
  }
});


router.delete('/:id', auth, async (req, res) => {
  const { id } = req.query;
  const article = await Article.findOne({ _id: id });
  
  const ability = defineAbilitiesFor(req.user);
  if (ability.can('delete', 'Article')){

    if (!req.user.isAdmin && article.author.toString()  !== req.user.userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à suprimer cet article' });
    }

    try {
      Article.deleteOne({ _id: id })
      .then(() => res.status(200).json({message : 'Article supprimé!'}))
      .catch((error) => res.status(500).send("Erreur lors de la suppression de l'article"));
    } catch (error) {
      res.status(500).send('Erreur lors de la suppression de l\'article');
    }
  } else {
    res.status(403).json({ error: "Vous n'êtes pas autorisé à suprimer cet article" });
  }
});

module.exports = router;
