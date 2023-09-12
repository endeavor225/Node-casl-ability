// ability.js
const { AbilityBuilder, Ability } = require('@casl/ability');

const defineAbilitiesFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.isAdmin) {
    can('manage', 'all');
  } else {
    can('read', 'all');
    can('create', 'Article');
    can('update', 'Article', { author: user.userId});
    can('delete', 'Article', { author: user.userId});
  }

  return build();
};

module.exports = defineAbilitiesFor;
