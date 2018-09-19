const db = require("../models");
const jwt = require("jsonwebtoken");

exports.login = async function (req, res, next) {
    // finding a user
    try {
        let user = await db.User.findOne({ email: req.body.email });
        let { id, username, photo } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            let token = jwt.sign({ id, username, photo }, process.env.SECRET_KEY );
            return res.status(200).json({ id, username,  photo, token });
        } else {
            return next({ status: 400, message: "Invalid Password." });
        }
    }
    catch (err) {
        return next({ status: 400, message: "User does not exist." });
    }
};

exports.register = async function (req, res, next) {
    try {
        let user = await db.User.create(req.body);
        let { id, username, photo } = user;
        let token = jwt.sign({ id, username, photo }, process.env.SECRET_KEY );

        return res.status(200).json({ id, username, photo, token });        
    } 
    
    catch (err) {
        if (err.code === 11000) {
            err.message = "Sorry, that username or email is taken";
        }

        return next({ status: 400, message: err.message });
    }
};