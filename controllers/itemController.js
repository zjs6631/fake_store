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