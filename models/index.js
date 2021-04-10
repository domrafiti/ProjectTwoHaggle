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

// Listing.hasOne(Status, {
//   foreignKey: 'listing_id'
// });

// Listing.hasMany(Category, {
//   foreignKey: 'listing_id'
// });

// Category.hasMany(Listing, {
// foreignKey: 'category_id'
// });

module.exports = { User, Listing, Category, Status };
