const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
var cors = require("cors");

const app = express();

var corsOptions = {
    credentials:true,
    origin:'http://localhost:3000',
    optionsSuccessStatus:200
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(Router);

app.listen(3001, () => {
    console.log("Server is runnning at 3001");
});

// const Phone = mongoosee.model('phoneListing', schema);
// const query = Phone.findOne({
//     'brand': 'Samsung'
// },
// 'brand title',
// function (err, phone) {
//     if (err) return handleError(err);
//     console.log(phone);
// });

// const connection = mongoosee.connection;
// connection.once('open', async function() {
//     const collection = connection.db.collection('phoneListing');
//     collection.find({}).toArray(function(err, data) {
//         console.log(data);
//     });
// });




