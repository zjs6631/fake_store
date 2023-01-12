var express = require('express');
var router = express.Router();

const item_controller = require("../controllers/itemController");

const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images')
    },
    filename: (req, file, cb) =>{
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname)) //the replaced name
    }
});

const upload = multer({storage : storage})


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
router.post('/createItem', upload.single("image"), item_controller.item_create_post);

router.get('/catalog/item/:id/deleteItem', item_controller.item_delete_get);

router.post('/catalog/item/:id/deleteItem', item_controller.item_delete_post);

router.get('/catalog/item/:id/updateItem', item_controller.item_update_get);

router.post('/catalog/item/:id/updateItem', upload.single("image"), item_controller.item_update_post);

module.exports = router;
