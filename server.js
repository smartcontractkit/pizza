// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const pizzapi = require('dominos');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/stores/:zip', function(req, res) {
  const zip = req.params.zip
  pizzapi.Util.findNearbyStores(zip, 'Delivery', dom => {
    res.json({stores: dom.result.Stores})
  })
})

app.use('/', router)

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
