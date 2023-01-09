const Item = require("../models/item");

const async = require("async");

const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
const { isObjectIdOrHexString } = require("mongoose");

//Display a home page

exports.index = function (req, res, next){
    Category.find()
        .sort([["name", "ascending"]])
        .exec(function(err, list_categories){
            if(err){
                return next(err)
            }
            //if success then render
            res.render("index", {
                title: "Home",
                category_list: list_categories,
            });
        });
}

//Display a list of all Items

exports.item_list = function (req, res, next) {
    Item.find()
        .sort([["name", "ascending"]])
        .exec(function(err, list_items){
            if(err){
                return next(err);
            }
            //if it's successfull then we render
            res.render("item_list", {
                title: "Inventory",
                item_list: list_items,
            });
        });
};

//Display a list of all books in store

exports.book_list = function (req, res, next){
    Item.find({category: '63b9b48c926cd695a1430bc3'})
        .sort([["name", "ascending"]])
        .exec(function(err, list_books){
            if(err){
                return next(err);
            }

            //if successful then render
            res.render("book_list", {
                title: "Book Inventory",
                book_list: list_books,
            });
        });
}

//Display a list of all book pins

exports.book_pin_list = function (req, res, next){
    Item.find({category: '63b9b48e926cd695a1430bc6'})
        .sort([["name", "ascending"]])
        .exec(function(err, list_book_pins){
            if(err){
                return next(err);
            }
            //if success
            res.render("book_pin_list", {
                title: "Book Pin Inventory",
                book_pin_list: list_book_pins,
            });
        })
}

//Display a list of all bookmarks

exports.bookmark_list = function(req, res, next){
    Item.find({category: '63b9bc3ddb47934b217a2a95'})
        .sort([["name", "ascending"]])
        .exec(function(err, list_bookmarks){
            if(err){
                return next(err);
            }
            //if success
            res.render("bookmark_list", {
                title: "Bookmark Inventory",
                bookmark_list: list_bookmarks,
            });
        })
}

//Display a list of page overlays

exports.pageoverlays_list = function(req, res, next){
    Item.find({category: '63b9b48e926cd695a1430bc8'})
        .sort([["name", "ascending"]])
        .exec(function(err, list_overlays){
            if(err){
                return next(err);
            }

            //success
            res.render("page_overlay_list", {
                title: "Page Overlay Inventory",
                overlay_list: list_overlays,
            });
        });
}

//Display a specific item and it's information 

exports.item_detail = (req, res, next) =>{
    Item.findById(req.params.id)
        .populate("category")
        .exec(function(err, item_info){
            if(err){
                return next(err);
            }

            res.render("item_info", {
                title: item_info.name,
                item_info: item_info,
            });
        });

}

//Display item form on GET request

exports.item_create_get = (req, res, next) =>{
    Category.find()
        .sort([["name", "ascending"]])
        .exec(function(err, categories){
            if(err){
                return next(err);
            }
    res.render("item_form", {title: 'Create new item', categories: categories});
});
}

exports.item_create_post = [
    body("name", "Item name required").trim().isLength({min: 1}).escape(),
    body("description", "Item description required").trim().isLength({min: 1}).escape(),
    body("category", "Item category required").trim().isLength({min: 1}).escape(),
    


    //process after the validation above is performed
    (req, res, next) =>{
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
        });

        if(!errors.isEmpty()){
            async.parallel(
                (err, results) => {
                    if (err) {
                      return next(err);
                    }
                

                    for (const category of results.categories) {
                        if (item.category.includes(category._id)) {
                          category.checked = "true";
                        }
                      }

                    res.render("item_form", {
                        title: "Create Item",
                        name: results.name,
                        description: results.description,
                        category: results.categories,
                        price: results.price,
                        number_in_stock: results.number_in_stock
                    });
                }
            );
            return;
        }

        item.save((err)=>{
            if(err){
                return next(err);
            }
            //success?
            res.redirect(item.url);
        })

    },

    

    
]