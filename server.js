'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const helmet      = require('helmet');
const MongoClient = require('mongodb').MongoClient;

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

// Connection URL
const url = process.env.DB;
// Database Name
const dbName = 'back-end-projects';
// Create a new MongoClient
const client = new MongoClient(url, {
    useNewUrlParser: true
});

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({
  frameguard: {
    action: 'sameorigin'
    /// will prevent anyone from putting this page in an iframe unless it’s on the same origin.
    //That generally means that you can put your own pages in iframes, but nobody else can.
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://code.jquery.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://use.fontawesome.com'],
      fontSrc : ["'self'", 'https://fonts.gstatic.com', 'https://use.fontawesome.com' ]
    }
  },
  dnsPrefetchControl: { 
    allow: false // Disable DNS Prefetching 
  } 
}));

//Sample front-end

app.route('/b/:board/')
  .get(function (req, res) {
  res.sendFile(process.cwd() + '/views/board.html');
});

app.route('/b/:board/:threadid')
  .get(function (req, res) {
  res.sendFile(process.cwd() + '/views/thread.html');
});

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Connecting to the database
client.connect((err) => {
  
  const db = client.db(dbName);
  
  if (err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    
    //Routing for API 
    apiRoutes(app, db); //instantiating the api.js module
    
    //404 Not Found Middleware
    app.use((req, res, next) => {
      res.status(404)
         .type('text')
         .send('Not Found');
    });
  }
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
