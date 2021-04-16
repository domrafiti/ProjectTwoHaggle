const router = require('express').Router();
const { User } = require('../../models');


//----------ALL NEW---------//
const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("check");
    cb(null, './tmp_uploads/');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`);
  },
});

const upload = multer({ storage }); // or simply { dest: 'uploads/' }

router.post('/', upload.array('bruce-wayne'), async (req, res) => {
  console.log(req.body, req.files);

  try {
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      picture_path: req.files[0].path,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      //res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
  res.redirect('/profile');
});
//-----------------------ENDS HERE---------------------------------------//

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
