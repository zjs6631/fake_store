var express = require('express');
var router = express.Router();

const item_controller = require("../controllers/itemController");


//GET home page
router.get('/', item_controller.index);

/* GET inventory page. */
router.get('/inventory', item_controller.item_list);

//GET book list page
router.get('/book', item_controller.book_list);


//GET book pin list page using book-pin view
router.get('/Book-Pin', item_controller.book_pin_list);

//GET bookmark list page using bookmark-list view
router.get('/Bookmark', item_controller.bookmark_list);

//GET overlay list using page_overlay_list view
router.get('/Page%20Overlays', item_controller.pageoverlays_list);

//GET details for specific item
router.get('/catalog/item/:id', item_controller.item_detail);

//GET request for creating new item
router.get('/createItem', item_controller.item_create_get);

//GET request for creating new item
router.post('/createItem', item_controller.item_create_post);

module.exports = router;
