const router = require('express').Router();
const { Listing, User, Category, Status } = require('../models');
const withAuth = require('../utils/auth');

// Homepage route
router.get('/', async (req, res) => {
  try {
    const listingData = await Listing.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Status,
          attributes: ['type'],
        },
      ],
    });

    // Serialize data so the template can read it
    const listings = listingData.map((listing) => listing.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      listings,
      logged_in: req.session.logged_in,
      logged_user: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Individiual Listing Route
router.get('/listing/:id', async (req, res) => {
  try {
    const listingData = await Listing.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Status,
          attributes: ['type'],
        },
      ],
    });

    const listing = listingData.get({ plain: true });

    res.render('listing', {
      ...listing,
      logged_in: req.session.logged_in,
      logged_user: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//User Listing Route
router.get('/listings', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      include: [
        {
          model: Listing,
          attributes: [
            'title',
            'description',
            'category_id',
            'status_id',
            'date_created',
          ],
        },
        // {
        //   model: Category,
        //   attributes: ['name'],
        // },
        // {
        //   model: Status,
        //   attributes: ['type'],
        // },
      ],
    });

    const user = userData.get({ plain: true });

    res.render('listings', {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Listing }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
