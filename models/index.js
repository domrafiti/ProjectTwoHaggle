const User = require('./User');
const Listing = require('./Listing');
const Category = require('./Category');
const Status = require('./Status');

User.hasMany(Listing, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Listing.belongsTo(User, {
  foreignKey: 'user_id',
});

Status.hasMany(Listing, {
  foreignKey: 'status_id'
});

Listing.belongsTo(Status, {
  foreignKey: 'status_id',
});

Category.hasMany(Listing, {
foreignKey: 'category_id'
});

Listing.belongsTo(Category, {
  foreignKey: 'category_id',
});

module.exports = { User, Listing, Category, Status };
