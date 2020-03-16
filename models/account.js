const mongoose = require('mongoose'), bcrypt = require('bcrypt'), jwt = require('jsonwebtoken'), uniqid = require('uniqid');

let friendshipSchema = mongoose.Schema({
    _id: String,
    friend: String,
    accepted: Boolean,
    created_at: { type: Date, default: Date.now }
}, { _id: false });

let accountSchema = mongoose.Schema({
    uniqid: String,
    first_name: String,
    last_name: String,
    email: {
        type: String,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
        lowercase: true
    },
    gender: {
        type: String,
        enum: ['m', 'f']
    },
    birthday: Date,
    friendship: [friendshipSchema],
    hash: String,
    created_at: { type: Date, default: Date.now }
});

accountSchema.statics.setFriendshipUniqid = function setId(user1, user2){
    friendship_uniqid = uniqid(`${user1.first_name.toLowerCase()}-${user2.first_name.toLowerCase()}.`);
    return {
        sender: {
            _id: friendship_uniqid,
            accepted: false,
            friend: user2.uniqid
        },
        receiver: {
            _id: friendship_uniqid,
            accepted: false,
            friend: user1.uniqid
        }
    }
}

accountSchema.statics.setHash = function setHash(password) {
    return bcrypt.hashSync(password, 10);
}

accountSchema.statics.verifyHash = function verifyHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}

accountSchema.statics.setUniqid = function setUniqid(first_name) {
    return uniqid(`${first_name.toLowerCase()}.`);
}

// Probably delete in next commits
// accountSchema.statics.retrieveUser = function retrieveUser(jwt) {
//     return jwt.decode(jwt).id;
// }

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;