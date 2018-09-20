// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const dominos = require('dominos');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/order/:zip', function(req, res) {
  const params = req.params
  const zip = params.zip
  dominos.Util.findNearbyStores(zip, 'Delivery', dom => {
    const stores = dom.result.Stores
    if (stores.length > 0) {
      const order = buildOrder(stores[0].StoreID, params)
      res.json({hello: "world", order: order})
    } else {
      res.json({errors: ["No stores available to order from"]})
    }
  })
})

const buildAddress = (params) => {
  return new dominos.Address({
    Street: params.street,
    City: params.city,
    Region: params.state,
    PostalCode: params.zip
  })
}

const buildCustomer = (params) => {
  return new dominos.Address({
    address: buildAddress(params),
    firstName: params.firstName,
    lastName: params.lastName,
    phone: params.phoneNumber,
    email: params.email
  })
}

const buildOrder = (storeID, params) => {
  const customer = buildCustomer(params)
  const order = new dominos.Order({
    customer: customer,
    deliveryMethod: 'Delivery',
    storeID: storeID
  })
  const inches = "14"
  order.addItem(new dominos.Item({
    code: `${inches}SCREEN`,
    options: [],
    quantity: 1
  }))
  return order
}

// https://codegist.net/snippet/c/dominos-modelscs_riaevangelist_c
// Options:
//   A  - Anchovies
//   B  - Beef
//   Bq - BBQSauce
//   Cp - ShreddedProvoloneCheese
//   Cs - ShreddedParmesanAsiago
//   Du - PremiumChicken
//   E  - CheddarCheese
//   F  - Garlic
//   Fe - FetaCheese
//   G  - GreenPeppers
//   H  - Ham
//   Ht - HotSauce
//   J  - JalapenoPeppers
//   K  - Bacon
//   M  - Mushrooms
//   N  - Pineapple
//   O  - Onions
//   P  - Pepperoni
//   Pm - PhillySteak
//   R  - BlackOlives
//   Rr - RoastedRedPeppers
//   S  - ItalianSausage
//   Sa - Salami
//   Sb - SlicedItalianSausage
//   Si - Spinach
//   Td - DicedTomatoes
//   X  - RobustInspiredTomatoSauce
//   Xm - HeartyMarinaraSauce
//   Xw - WhiteSauce
//   Z  - BananaPeppers

app.use('/', router)

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
