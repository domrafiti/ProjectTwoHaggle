const router = require('express').Router();
const { User } = require('../../models');

const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('check');
    cb(null, './public/tmp_uploads/');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`);
  },
});

const upload = multer({ storage });
router.post('/', upload.array('bruce-wayne'), async (req, res) => {
  console.log(req.body, req.files);

  try {
    console.log('IM TRYING');
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      picture_path: '/tmp_uploads/' + req.files[0].filename,
    });
    console.log('create Complete');

    req.session.save(() => {
      console.log('saving session');
      req.session.user_id = userData.id;
      req.session.logged_in = true;
    });
    res.redirect('/profile');
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_name = userData.name;
      req.session.logged_email = userData.email;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
