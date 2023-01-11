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

    const errors = validationResult(req);

    Category.find()
        .sort([["name", "ascending"]])
        .exec(function(err, categories){
            if(err){
                return next(err);
            }
    res.render("item_form", {title: 'Create new item', categories: categories, errors: errors});
});
}

exports.item_create_post = [
    body("name", "Item name required").trim().isLength({min: 1}).escape(),
    body("description", "Item description required").trim().isLength({min: 1}).escape(),
    body("price", "Item price required").isNumeric().escape(),
    body("number_in_stock", "Item stock required").isNumeric().escape(),
    


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
            Category.find()
                .sort([["name", "ascending"]])
                .exec(function(err, categories){
                    
                    if(err){
                        
                        return next(err);
                    }

                console.log("made it here");
                
                res.render("item_form", {title: 'Create new item', item: item, categories: categories, errors: errors.array()});

                return;
            });
            return;
        }

        

        item.save((err)=>{
            if(err){
                return next(err);
            }
            //success?
            res.redirect(item.url);
        });

    },

    

    
]

exports.item_delete_get = (req, res, next) =>{
    async.parallel(
        {
            item(callback){
                Item.findById(req.params.id).exec(callback);
            }
        },
        (err, results) =>{
            if (err){
                return next(err);
            }
            if(results.item == null){
                res.redirect("/inventory");
            }
            console.log("made it here");
            //success
            res.render("delete_item", {
                title: "Delete Item",
                item: results.item,
            });
        }
    )
}

exports.item_delete_post = (req, res, next) =>{
    async.parallel(
        {
            item(callback){
                Item.findById(req.params.id).exec(callback);
            },
        },
        (err, results) =>{
            if(err){
                return next(err);
            }
        },

        console.log(req.params),
        //success
        Item.findByIdAndRemove(req.params.id, (err) =>{
            if(err){
                return next(err);
            }
            
            res.redirect("/inventory");
        },
    
    )
    )
}

exports.item_update_get = (req, res, next) =>{

    async.parallel(
        {
            item(callback){
                Item.findById(req.params.id)
                    .populate("category")
                    .exec(callback)
            },
            categories(callback){
                Category.find(callback);
            }
        },
            
        (err, results) =>{
            if(err){
                return next(err);
            }
            if(results.item == null){
                const err = new Error("Item not found");
                err.status = 404;
                return next(err);
            }
            console.log(results.item.category);
            for(const category of results.categories){
                
                for(const c of results.item.category){
                    
                    if(category._id.toString() == c._id.toString()){
                        c.checked = "true";
                    }
                }
            }
            const errors = validationResult(req);
            res.render("update_form", {
                item: results.item,
                categories: results.categories,
                errors: errors
            })
        }
    )
}

exports.item_update_post = [
    body("name", "Item name required").trim().isLength({min: 1}).escape(),
    body("description", "Item description required").trim().isLength({min: 1}).escape(),
    body("price", "Item price required").isNumeric().escape(),
    body("number_in_stock", "Item stock required").isNumeric().escape(),
    


    //process after the validation above is performed
    (req, res, next) =>{
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            _id: req.params.id //use old items id to update or a new id will be assigned
        });


        if(!errors.isEmpty()){
            Category.find()
                .sort([["name", "ascending"]])
                .exec(function(err, categories){
                    
                    if(err){
                        
                        return next(err);
                    }

                console.log("made it here");
                
                res.render("update_form", {title: 'Update item', item: item, categories: categories, errors: errors.array()});

                return;
            });
            return;
        }

        

        Item.findByIdAndUpdate(req.params.id, item, {}, (err, theItem) =>{
            if(err){
                return next(err);
            }
            console.log(theItem);
            res.redirect(theItem.url);
        })

    },

    

    
]
