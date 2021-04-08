const sequelize = require('../config/connection');
const { User, Listing, Category, Status } = require('../models');

const userData = require('./userData.json');
const listingData = require('./listingData.json');
const categoryData = require('./categoryData.json');
const statusData = require('./statusData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const listing of listingData) {
    await Listing.create({
      ...listing,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  await Category.bulkCreate(categoryData);

  await Status.bulkCreate(statusData);

  process.exit(0);
};

seedDatabase();
