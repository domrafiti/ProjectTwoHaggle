const router = require('express').Router();
const { Listing } = require('../../models');
const withAuth = require('../../utils/auth');

// router.post('/', withAuth, async (req, res) => {
//   try {
//     const newListing = await Listing.create({
//       ...req.body,
//       user_id: req.session.user_id,
//     });

//     res.status(200).json(newListing);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.update(
      {
        title: req.body.title,
        description: req.body.description,
        category_id: req.body.category_id,
        status_id: req.body.status_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(req.params.id);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.delete('/:id', withAuth, async (req, res) => {
//   try {
//     const projectData = await Project.destroy({
//       where: {
//         id: req.params.id,
//         user_id: req.session.user_id,
//       },
//     });

//     if (!projectData) {
//       res.status(404).json({ message: 'No project found with this id!' });
//       return;
//     }

//     res.status(200).json(projectData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
