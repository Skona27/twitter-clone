// --- USER MODEL --- //

// requirements
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Message = require("./message");

// create a new schema for USER model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "http://mehandis.net/wp-content/uploads/2017/12/default-user-300x300.png"
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
});

// hook
userSchema.pre("save", async function(next) {
    try {
        if(!this.isModified("password")) {
            return next();
        }
        let hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        return next();
    }
    catch(err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err) {
        next(err);
    }
}

// create new model from schema
// we name our model user, we pass schema
const User = mongoose.model("User", userSchema);

module.exports = User;