# ![Haggle](https://raw.githubusercontent.com/domrafiti/ProjectTwoHaggle/main/public/img/email_logo.png)

## Description

This application allows users to trade goods and services for other goods and services on a cashless/currency-less platform. You are able to view listings from all other users and send an email of interest to the poster to start the hagglin' process. 

With COVID-19 and the financial burden brought upon many, this application is intended to assist in helping users acquire needed items with what they can part ways with.

Main challenges faced when creating this application were uploading images into the database, sending automated emails for interested users, and the overall time constraint of the project. For future improvements, we would like to create an in application messaging system, rating system for each user based on their haggle transactions, and a mobile application.

## Table of Contents

- [Installation](#Installation)
- [Usage](#usage)
- [Technolgies Utilized](#Technologies-Utilized)
- [Deployed Apllication](#Deployed-Application-Link)
- [Credits](#credits)
- [Contributors](#Contributors)
- [License](#license)

## Installation

To install this repository for use, you will need to download all files in the [Project Two Haggle](https://github.com/domrafiti/ProjectTwoHaggle) repository. You will then need to run the schema.sql file within the db folder in MySQL to set the database. 

Open your terminal and initialize your node models by running:
```bash
npm i
```
Once this is done, then run the following to populate your database with information. 
```bash
npm run seed
```
Last, run the following to initialize your local server:
```bash
npm run start
```

Please note, you will need to updated the .env file with your MySQL credentials to run this application on your computer.

## Usage

As a user, you will start on the homepage that contains a carousel of listings. You can also see a list of the listings when click on the "View All Listings" link in the navbar. to interact with the listings, you will need to login or sign-up by clicking on the "Login" link in the navbar.

Once logged in, you will be directed to your profile. This profile page gives you the ability to create a listing, view your current listings, or delete a listing. If you click a specific listing to view it, you will be able to edit the listing as well.

From the profile page you can re-visit the "View All Listings" link in the navbar. If you select a specific listing from the list, it will now show you the listing information and the ability to express interest in the item.

When expressing interest in a listing, an email will be sent to the poster of the listing stating your interest. They will be able to acccept or decline your interest. If they accept, the haggle proccess will begin and end if both parties come to a completed agreement.


Please reference a flow diagram of the application: 
![Flow Diagram](https://raw.githubusercontent.com/domrafiti/ProjectTwoHaggle/main/Workflow-Diagram.jpeg)

## Technologies-Utilized

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node,js](https://nodejs.org/en/)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars) 
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [Sequelize](https://www.npmjs.com/package/sequelize)
- [dotenv package](https://www.npmjs.com/package/dotenv)
- [bcrypt package](https://www.npmjs.com/package/bcrypt) 
- [express-session](https://www.npmjs.com/package/express-session)
- [connect-session-sequelize](https://www.npmjs.com/package/connect-session-sequelize)
- [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail)
- [multer](https://www.npmjs.com/package/multer)
- [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [jQuery](https://code.jquery.com/)
- [Font Awesome](https://fontawesome.com/)

## Deployed-Application-Link

- [Deployed Link](https://haggle-proj.herokuapp.com/)

# Screenshots of the application:

* Mobile:

![Mobile](https://raw.githubusercontent.com/domrafiti/ProjectTwoHaggle/main/haggle_mobile.png)

* Desktop:

![Desktop](https://raw.githubusercontent.com/domrafiti/ProjectTwoHaggle/main/haggle_desktop.png)

## Contributors

<img src="https://contrib.rocks/image?repo=domrafiti/ProjectTwoHaggle" />

* [domrafiti](https://github.com/domrafiti)

* [glchavez](https://github.com/glchavez)

* [bahuisken](https://github.com/bahuisken)

* [Kblack4290](https://github.com/Kblack4290)

## Credits

I would like to provide credit to [The Denver Univeristy Coding Bootcamp](https://bootcamp.du.edu/coding/) for providing me with the materials, intstructions, and one-on-one assistance to perform this project.

## License


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Copyright &copy; 2021 Giovany Chavez, Brice Huisken, Dominick Rafiti, Keith Black

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
