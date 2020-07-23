var mongoose = require('mongoose')

var bcrypt = require('bcrypt')

var user = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    access_level: {
        type: Number //1 is user, 2 is moderator, 3 is administrator
    },
    predefined: {
        type: Boolean,
        default: false
    }
},
{
    collection: 'users'
})

user.pre('remove', function(next) {
    if(this.special)
    {
        return next(new Error("Sorry, you can't remove pre-defined user"))
    }
    return next()
})

user.pre('save', function(next) {
    if(this.special)
    {
        if(this.isModified('access_level')) return next(new Error("You can't modify the access level of a pre-defined user"))
        if(this.isModified('email')) return next(new Error("You can't modify the email of a pre-defined user"))
    }
    if(this.isModified('password') || this.isNew)
    {
        this.password = bcrypt.hashSync(this.password, 10)
    }
    return next()
})

module.exports = mongoose.model('User', user)