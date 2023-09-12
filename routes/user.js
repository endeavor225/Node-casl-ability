// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

const defineAbilitiesFor = require('../permission/permissions');

// Middleware pour vérifier les autorisations
const checkPermissions = (action, resource) => {
  return (req, res, next) => {
    const { user } = req;
    const ability = defineAbilitiesFor(user);
    if (!ability.can(action, resource)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
  };
};

// Route pour créer un user
router.post('/', async (req, res) => {
  const { username, isAdmin, isEditor } = req.body;
  try {
    const user = new User({ ...req.body});
    await user.save();
    res.send('User créé avec succès');
  } catch (error) {
    res.status(500).send('Erreur lors de la création de l\'user');
  }
});

router.get('/', auth, checkPermissions('read', 'User'), async (req, res) => {
  try {
    const user = await User.find();
    if (!user) return res.status(404).send('User non trouvé');

    res.json(user);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération de l\'user');
  }
});


router.get('/:id', checkPermissions('read', 'User'), async (req, res) => {
  // Récupérez l'user ici en utilisant l'ID de req.params.id
  const { id } = req.query;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User non trouvé');

    res.json(user);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération de l\'user');
  }
});


module.exports = router;
