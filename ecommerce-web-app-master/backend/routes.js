const express = require("express");
const dataModel = require("./models/db.js");
const app = express();

app.get('/soldOutSoon', async (request, response) => {
    dataModel.soldOutSoon(function(err, result) {
        try {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        } catch (error) {
            response.status(500).send(error);
        }
    });
});

app.get("/bestSellers", async (request, response) => {
    dataModel.bestSellers(function(err, result) {
        try {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        } catch (error) {
            response.status(500).send(error);
        }
    });
});

app.post("/targetPhones", async (request, response) => {
    try {
        const title = request.body.title;
        const brand = request.body.brand;
        const price = request.body.price;
        dataModel.searchPhone(title, brand, price, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        response.status(500).send(error);
        console.log(error);
    }
});

app.post("/phoneInfo", async (request, response) => {
    try {
        const phoneId = request.body.phoneId;
        dataModel.phoneInfo(phoneId, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                response.json(result);
            }
        })
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    } 
});

app.post("/newPhone", async (request, response) => {
    try {
        dataModel.newPhone(request.body, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/userInfo", async (request, response) => {
    try {
        const userId = request.body.userId;
        dataModel.userInfo(userId, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        })
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/userInfoByEmail", async (request, response) => {
    try {
        const email = request.body.email;
        dataModel.userInfoByEmail(email, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        })
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/newComment", async (request, response) => {
    try {
        const phoneId = request.body.phoneId;
        const comment = request.body.comment;
        dataModel.newComment(phoneId, comment, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json("OK");
            }
        });
    } catch (error) {
        response.status(500).send(error);
    }

});

app.post("/allPhonesBySeller", async (request, response) => {
    try {
        const userId = request.body.userId;
        dataModel.allPhonesBySeller(userId, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }

});

app.post("/checkout", async (request, response) => {
    try {
        const cart = request.body;
        dataModel.checkout(cart);
        response.json("OK");
    } catch (error) {
        console.log("Error In Checkout");
        response.status(500).send(error);
    }
});

app.post("/disablePhone", async (request, response) => {
    try {
        const phoneId = request.body.phoneId;
        dataModel.disablePhone(phoneId, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    } 
});

app.post("/enablePhone", async (request, response) => {
    try {
        const phoneId = request.body.phoneId;
        dataModel.enablePhone(phoneId, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    } 
});

app.post("/removePhone", async (request, response) => {
    try {
        const phoneId = request.body.phoneId;
        dataModel.removePhone(phoneId, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.post("/newUser", async (request, response) => {
    try {
        const userInfo = request.body;
        dataModel.newUser(userInfo, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

app.post("/updateUserInfo", async (request, response) => {
    try {
        const userId = request.body.userId;
        const userInfo = request.body.userInfo;
        dataModel.updateUserInfo(userId, userInfo, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

module.exports = app;