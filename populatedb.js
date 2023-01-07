#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function itemCreate(name, description, category, price, number_in_stock, cb) {
  itemdetail = {name: name , description: description, category: category, price:price, number_in_stock:number_in_stock}
  /*
  if (d_birth != false) authordetail.date_of_birth = d_birth
  if (d_death != false) authordetail.date_of_death = d_death
  */
  
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description:description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

/*
function bookCreate(title, summary, isbn, author, genre, cb) {
  bookdetail = { 
    title: title,
    summary: summary,
    author: author,
    isbn: isbn
  }
  if (genre != false) bookdetail.genre = genre
    
  var book = new Book(bookdetail);    
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}


function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = { 
    book: book,
    imprint: imprint
  }    
  if (due_back != false) bookinstancedetail.due_back = due_back
  if (status != false) bookinstancedetail.status = status
    
  var bookinstance = new BookInstance(bookinstancedetail);    
  bookinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BookInstance: ' + bookinstance);
      cb(err, null)
      return
    }
    console.log('New BookInstance: ' + bookinstance);
    bookinstances.push(bookinstance)
    cb(null, book)
  }  );
}
*/

function createItems(cb) {
    async.series([
      function(callback){
        categoryCreate("Bookmark", "Laminated, Condition: New", callback);
      },
        function(callback) {
          itemCreate('Baby Yoda bookmark', 'Laminated custom bookmark with Baby Yoda art', 
          [categories[3]], 3.5, 10, callback);
        },
        function(callback) {
          itemCreate('Fall foliage bookmark','Laminated bookmark with fall colored leaves', 
          [categories[3]], 3.5, 2, callback);
        },
        function(callback) {
          itemCreate('Stack O\' Books bookmark', 'Laminated bookmark featuring a stack of books', 
          [categories[3]], 5.5, 5, callback);
        },
        function(callback) {
          itemCreate('Wing span bookmark', 'Laminated bookmark featuring fae wings', 
          [categories[3]], 4.5, 5, callback);
        },
        function(callback) {
          itemCreate('Kingdom of the wicked page overlays', 'decorative page overlays for the kingdom of the wicked series', 
          [categories[2]], 25.5, 6, callback);
        },
        function(callback) {
          itemCreate('Kingdom of the Wicked', 'Emilia and her twin sister Vittoria are streghe - witches who live secretly among humans, avoiding notice and persecution. One night, Vittoria misses dinner service at the family\'s renowned Sicilian restaurant. Emilia soon finds the body of her beloved twin...desecrated beyond belief. Devastated, Emilia sets out to find her sister\'s killer and to seek vengeance at any cost—even if it means using dark magic that\'s been long forbidden.', 
          [categories[0]], 15.5, 5, callback);
        },
        function(callback) {
          itemCreate('Kingdom of the Cursed', 'After selling her soul to become Queen of the Wicked, Emilia travels to the Seven Circles with the enigmatic Prince of Wrath, where she’s introduced to a seductive world of vice.', 
          [categories[0]], 14.5, 5, callback);
        },
        function(callback) {
          itemCreate('Kingdom of the Feared', 'Emilia is reeling from the shocking discovery that her twin sister, Vittoria, is alive. But before she faces the demons of her past, Emilia yearns to claim her king, the seductive Prince of Wrath, in the flesh. Emilia doesn’t simply desire his body, she wants his heart and soul—but that’s something the enigmatic demon can’t promise her.', 
          [categories[0]], 14.5, 5, callback);
        },
        function(callback) {
          itemCreate('Dragon book pin', '100% steel machine-pressed pin with black dragon', 
          [categories[1]], 35.5, 5, callback);
        },
        ],
        // optional callback
        cb);
}

/*
function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate('Test Book 1', 'Summary of test book 1', 'ISBN111111', authors[4], [genres[0],genres[1]], callback);
        },
        function(callback) {
          bookCreate('Test Book 2', 'Summary of test book 2', 'ISBN222222', authors[4], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createBookInstances(cb) {
    async.parallel([
        function(callback) {
          bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], ' Gollancz, 2011.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[2], ' Gollancz, 2015.', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Maintenance', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[0], 'Imprint XXX2', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], 'Imprint XXX3', false, false, callback)
        }
        ],
        // Optional callback
        cb);
}

*/

async.series([
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+ items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




