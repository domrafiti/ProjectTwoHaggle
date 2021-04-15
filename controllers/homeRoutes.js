const router = require('express').Router();
const { Listing, User, Category, Status } = require('../models');
const withAuth = require('../utils/auth');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    // or 
    // uuid, or fieldname
    cb(null, originalname);
  }
})
const upload = multer({ storage }); // or simply { dest: 'uploads/' }



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
      query: req.query,
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
          attributes: ['name', 'id', 'email'],
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
      logged_name: req.session.logged_name,
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
            'id',
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


router.post('/interested', async (req, res) => {
  const msg = {
    to: req.body.em_to_email, // Change to your recipient
    from: 'haggleinc@gmail.com', // Change to your verified sender
    subject: `${req.body.em_to_name}, ${req.body.em_from_name} is interested in one of your Haggles`,
    // text: 'Easy to do anywhere, even with Node.js',
    html: `<p>${req.body.em_from_name} is interested in the following Haggle you posted:</p>
    <p><strong>Title</strong>: ${req.body.em_title}<br>
    <strong>Description</strong>: ${req.body.em_desc}<br>
    <strong>Category</strong>: ${req.body.em_cat}</p>
    <p><a href="http://localhost:3001/">Click Here to see ${req.body.em_from_name}'s Haggles</a></p>
    <p>Happy Hagglin'</p>`,
  };

  try {
    await sgMail.send(msg);
    res.redirect('/?interest=sent');
    return;
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.redirect('back');
  }
});

//--------------file upload code----------------------------------//

// Upload photos 
router.post('/upload', upload.array('john-wayne'), (req, res) => {
  console.log("posting");
  return res.json({ status: 'OK', uploaded: req.files.length });
});
//-----------------------file upload code----------------------------------//


module.exports = router;
