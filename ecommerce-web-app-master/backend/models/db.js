var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://root:root@cluster0.xeceb.mongodb.net/COMP5347?retryWrites=true&w=majority", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const phoneSchema = mongoose.Schema({
    title: String,
    brand: String,
    image: String,
    stock: Number,
    seller: String,
    price: Number,
    reviews: Array
}, {
  collection: 'phoneListing',
  versionKey: false
});

var Phone = mongoose.model('phoneListing', phoneSchema, 'phoneListing');

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String
}, {
  versionKey: false
});

var User = mongoose.model('userList', userSchema, 'userList');

module.exports.newUser = function(userInfo, callback) {
  User.create(userInfo, callback);
}

module.exports.updateUserInfo = function(userId, userInfo, callback) {
  User.findByIdAndUpdate(mongoose.Types.ObjectId(userId), userInfo, callback);
  // User.findOneAndUpdate({"_id": userId}, userInfo, callback);
}

module.exports.soldOutSoon = function(callback) {
  Phone.aggregate(
    [
      {
        '$sort': {
          'stock': 1
        }
      }, {
        '$match': {
          'stock': {
            '$gt': 0
          },
          'disable': {
            '$exists': false
          }
        }
      }, {
        '$limit': 5
      }, {
        '$project': {
          'price': 1, 
          'image': 1
        }
      }
    ]
  ).exec(callback);
}

module.exports.bestSellers = function(callback) {
  Phone.aggregate([
    {
      '$match': {
        'disable': {
          '$exists': false
        }
      }
    }, {
      '$project': {
        'image': 1, 
        'price': 1, 
        'reviews': 1, 
        'title': 1
      }
    }, {
      '$unwind': {
        'path': '$reviews', 
        'includeArrayIndex': 'index', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          'title': '$title', 
          'image': '$image',
          'id': '$_id'
        }, 
        'num': {
          '$count': {}
        }, 
        'totalRating': {
          '$sum': '$reviews.rating'
        }
      }
    }, {
      '$match': {
        'num': {
          '$gte': 2
        }
      }
    }, {
      '$project': {
        'avgRating': {
          '$divide': [
            '$totalRating', '$num'
          ]
        }
      }
    }, {
      '$sort': {
        'avgRating': -1
      }
    }, {
      '$limit': 5
    }, {
      '$replaceWith': {
        'image': '$_id.image', 
        '_id': '$_id.id',
        'avgRating': '$avgRating'
      }
    }
  ]).exec(callback);
}

module.exports.searchPhone = function(title, brand, price, callback) {
  Phone.aggregate([
    {
      '$match': {
        'title': {
          '$regex': new RegExp(title, 'i')
        }, 
        'brand': {
          '$regex': new RegExp(brand, 'i')
        },
        'price': {
          '$lte': price
        },
        'disable': {
          '$exists': false
        }
      }
    }, {
      '$project': {
        'title': 1,
        'brand': 1,
        'price': 1,
        'stock': 1
      }
    }
  ]).exec(callback);
}

module.exports.phoneInfo = function(id, callback) {
  Phone.aggregate([
    {
      '$match': {
        '_id': mongoose.Types.ObjectId(id)
      }
    }, {
      '$unwind': {
        'path': '$reviews', 
        'includeArrayIndex': 'index', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$set': {
        'reviews.reviewer': {
          '$convert': {
            'input': '$reviews.reviewer', 
            'to': 'objectId'
          }
        }
      }
    }, {
      '$lookup': {
        'from': 'userList', 
        'localField': 'reviews.reviewer', 
        'foreignField': '_id', 
        'as': 'reviews.userInfo'
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id', 
          'title': '$title', 
          'brand': '$brand', 
          'image': '$image', 
          'stock': '$stock', 
          'seller': '$seller', 
          'price': '$price'
        }, 
        'reviews': {
          '$push': '$reviews'
        }
      }
    }, {
      '$replaceWith': {
        '_id': '$_id._id', 
        'title': '$_id.title', 
        'brand': '$_id.brand', 
        'image': '$_id.image', 
        'stock': '$_id.stock', 
        'seller': '$_id.seller', 
        'price': '$_id.price', 
        'reviews': '$reviews'
      }
    }, {
      '$set': {
        'seller': {
          '$convert': {
            'input': '$seller', 
            'to': 'objectId'
          }
        }
      }
    }, {
      '$lookup': {
        'from': 'userList', 
        'localField': 'seller', 
        'foreignField': '_id', 
        'as': 'sellerInfo'
      }
    }
  ]).exec(callback);
  // Phone.findById(id).exec(callback);
}

module.exports.allPhonesBySeller = function(userId, callback) {
  Phone.aggregate([
    {
      '$match': {
        'seller': '6282613c778dad49593dbae7'
      }
    }, {
      '$unwind': {
        'path': '$reviews', 
        'includeArrayIndex': 'index', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$set': {
        'reviews.reviewer': {
          '$convert': {
            'input': '$seller', 
            'to': 'objectId'
          }
        }
      }
    }, {
      '$lookup': {
        'from': 'userList', 
        'localField': 'reviews.reviewer', 
        'foreignField': '_id', 
        'as': 'reviews.userInfo'
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id', 
          'title': '$title', 
          'brand': '$brand', 
          'image': '$image', 
          'stock': '$stock', 
          'seller': '$seller', 
          'price': '$price', 
          'disable': '$disable'
        }, 
        'reviews': {
          '$push': '$reviews'
        }
      }
    }, {
      '$replaceWith': {
        '_id': '$_id._id', 
        'title': '$_id.title', 
        'brand': '$_id.brand', 
        'image': '$_id.image', 
        'stock': '$_id.stock', 
        'seller': '$_id.seller', 
        'price': '$_id.price', 
        'reviews': '$reviews', 
        'disable': '$_id.disable'
      }
    }
  ]).exec(callback);
}

module.exports.newPhone = function(phoneInfo, callback) {
  Phone.create(phoneInfo, callback);
}

module.exports.disablePhone = function(phoneId, callback) {
  Phone.findByIdAndUpdate(mongoose.Types.ObjectId(phoneId), {disable: ''}, {new: true, upsert: true, strict: false}, callback);
}

module.exports.enablePhone = function(phoneId, callback) {
  Phone.findByIdAndUpdate(mongoose.Types.ObjectId(phoneId), {$unset: {disable: 1}}, {new: true, upsert: true, strict: false}, callback);
  // Phone.updateOne({"_id": phoneId}, {"$unset": {"disable": 1}}, {upsert: true}, callback);
}

module.exports.removePhone = function(phoneId, callback) {
  Phone.findOneAndRemove({"_id": phoneId}, callback);
}

module.exports.newComment = function(phoneId, comment, callback) {
  Phone.updateOne({"_id": phoneId}, {'$push': {"reviews": comment}}, callback);
}

module.exports.userInfo = function(id, callback) {
  User.findById(id, '-password').exec(callback);
}

module.exports.checkout = function(cart) {
  cart.forEach(element => {
    num = element.count;
    Phone.findById(element.id).exec(function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.stock >= element.count) {
          Phone.updateOne({"_id": element.id}, {"stock": result.stock - element.count}).exec(function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("OK");
              console.log(result);
            }
          });
      }
    })
  });

}

module.exports.userInfoByEmail = function(email, callback) {
  User.findOne({"email": email}, callback);
}