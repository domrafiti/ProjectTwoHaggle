const router = require('express').Router();
const { Listing, User, Category, Status } = require('../models');
const withAuth = require('../utils/auth');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;

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

// Use withAuth middleware to prevent access to route
router.get('/haggles/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Listing,
        },
      ],
    });

    const user = userData.get({ plain: true });

    res.render('haggles', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Logged in users Listing Route
router.get('/mylistings', async (req, res) => {
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
            'image_path',
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

    res.render('mylistings', {
      ...user,
      logged_in: req.session.logged_in,
      logged_name: req.session.logged_name,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/listings', async (req, res) => {
  try {
    const listingData = await Listing.findAll({
      where: {
        status_id: 1,
      },
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

    const listings = listingData.map((list) => list.get({ plain: true }));

    res.render('listings', {
      listings,
      logged_in: req.session.logged_in,
      logged_id: req.session.user_id,
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
    res.redirect('back');
    return;
  }

  res.render('login');
});

//--------------file upload code----------------------------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;

    // or
    // uuid, or fieldnamed
    cb(null, `${uuid()}-${originalname}`);
  },
});
const upload = multer({ storage }); // or simply { dest: 'uploads/' }
// Upload photos
router.post('/upload', upload.array('john-wayne'), async (req, res) => {
  console.log('posting');
  console.log(req.body, req.files[0].path);
  try {
    const newListing = await Listing.create({
      // ...req.body,
      title: req.body.listing_name,
      description: req.body.listing_desc,
      user_id: req.session.user_id,
      category_id: req.body.listing_category,
      status_id: req.body.listing_status,
      image_path: req.files[0].path,
    });

    //res.status(200).json(newListing);
  } catch (err) {
    res.status(400).json(err);
  }
  res.redirect('/profile');
});
//-----------------------file upload code----------------------------------//
router.post('/interested', async (req, res) => {
  const msg = {
    to: req.body.em_to_email, // Change to your recipient
    from: 'haggleinc@gmail.com', // Change to your verified sender
    subject: `${req.body.em_to_name}, ${req.body.em_from_name} is interested in one of your Haggles`,
    // text: 'Easy to do anywhere, even with Node.js',
    html: `<!DOCTYPE HTML
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
    <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <title></title>
  
    <style type="text/css">
      a {
        color: #ffffff;
        text-decoration: none;
      }
  
      @media (max-width: 480px) {
        #u_content_text_2 .v-text-align {
          text-align: center !important;
        }
      }
  
      @media only screen and (min-width: 570px) {
        .u-row {
          width: 550px !important;
        }
  
        .u-row .u-col {
          vertical-align: top;
        }
  
        .u-row .u-col-100 {
          width: 550px !important;
        }
  
      }
  
      @media (max-width: 570px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
  
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
  
        .u-row {
          width: calc(100% - 40px) !important;
        }
  
        .u-col {
          width: 100% !important;
        }
  
        .u-col>div {
          margin: 0 auto;
        }
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }
  
      p {
        margin: 0;
      }
  
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
  
      * {
        line-height: inherit;
      }
  
      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }
  
      @media (max-width: 480px) {
        .hide-mobile {
          display: none !important;
          max-height: 0px;
          overflow: hidden;
        }
  
      }
    </style>
  
  
  
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css">
    <!--<![endif]-->
  
  </head>
  
  <body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table
      style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
      cellpadding="0" cellspacing="0">
      <tbody>
        <tr style="vertical-align: top">
          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break:">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;background-image: url('https://lh4.googleusercontent.com/re3G3R4NIXBhmy-Ak4IIMlcHQVVO_PWET_ApAzTwUry1jLCPmg_GmLyrySsrkU73Pidt6nFn-AA_a13cPLTF');background-repeat: repeat;background-position: center top;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('images/image-1.png');background-repeat: repeat;background-position: center top;background-color: #fc5656;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="534" style="width: 534px;padding: 0px;border-top: 8px solid #000000;border-left: 8px solid #000000;border-right: 8px solid #000000;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                    <div style="width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="padding: 0px;border-top: 8px solid #000000;border-left: 8px solid #000000;border-right: 8px solid #000000;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px 10px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                      <img align="center" border="0" src="https://lh6.googleusercontent.com/52sPVT7PV6aIl0mwPTzOaoYExYVCcGbVy7R_9-d524tz-o8EMHMsAdWcyG6UoLN-fp8hvtsRkCbkWUvsUQbb" alt="Image" title="Image"
                                        style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 25%;max-width: 132.5px;"
                                        width="132.5" />
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:42px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="1%"
                                  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #fc5656;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td
                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <div class="v-text-align"
                                  style="color: #ffffff; line-height: 100%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 100%; text-align: center;"><strong><span
                                        style="font-size: 44px; line-height: 44px;"><span
                                          style="line-height: 44px; font-size: 44px;">${req.body.em_from_name.toUpperCase()} IS
                                          INTERESTED IN YOUR HAGGLE LISTING</span></span></strong></p>
  
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <div class="v-text-align"
                                  style="color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p><strong>Title</strong>: ${
                                    req.body.em_title
                                  }<br>
                                    <strong>Description</strong>: ${
                                      req.body.em_desc
                                    }<br>
                                    <strong>Category</strong>: ${
                                      req.body.em_cat
                                    }
                                  </p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <div class="v-text-align"
                                  style="color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%; text-align: center;"><span
                                      style="font-size: 48px; line-height: 67.2px;"><strong><span
                                          style="line-height: 67.2px; font-size: 48px;">HAPPY<br>HAGGLIN'</span></strong></span>
                                  </p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <div class="v-text-align" align="center">
                                  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Montserrat',sans-serif;"><tr><td class="v-text-align" style="font-family:'Montserrat',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:36px; v-text-anchor:middle; width:260px;" arcsize="11%" stroke="f" fillcolor="#eec60e"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Montserrat',sans-serif;"><![endif]-->
                                  <a href="http://localhost:3001/haggles/${
                                    req.body.em_from_id
                                  }" target="_blank"
                                    style="box-sizing: border-box;display: inline-block;font-family:'Montserrat',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #eec60e; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                                    <span style="display:block;padding:10px 70px;line-height:120%;"><strong><span
                                          style="font-size: 14px; line-height: 16.8px;">CLICK HERE TO SEE
                                          ${req.body.em_from_name.toUpperCase()}'S LISTINGS</span></strong></span>
                                  </a>
                                  <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table class="hide-mobile" style="font-family:'Montserrat',sans-serif;" role="presentation"
                          cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:56px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="1%"
                                  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #fc5656;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td
                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="1%"
                                  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #fc5656;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td
                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table id="u_content_text_2" style="font-family:'Montserrat',sans-serif;" role="presentation"
                          cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 17px 20px;font-family:'Montserrat',sans-serif;"
                                align="left">
  
                                <div class="v-text-align"
                                  style="color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%; text-align: left;"></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
                <div style="border-collapse: collapse;display: table;width: 100%;background-color: #000000;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #000000;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                  <div style="width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                      <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                        cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td
                              style="overflow-wrap:break-word;word-break:break-word;padding:40px;font-family:'Montserrat',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="color: #828388; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="font-size: 14px; line-height: 140%; text-align: center;"><span
                                    style="font-size: 14px; line-height: 19.6px;">&copy; Haggle.&nbsp; All Rights
                                    Reserved </span></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
              </div>
            </div>
  
  
  
           
  
  
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
  
  </html>`,
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

module.exports = router;
