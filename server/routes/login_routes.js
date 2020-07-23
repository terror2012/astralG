const express = require('express')

const mongoose = require('mongoose')

const router = express.Router();

const bcrypt = require('bcrypt')

const User = require('../models/users')

const isNotLogged = (req, res, next) => {
    if(req.session.user)
    {
        if(req.session.user.access_level === 3)
        {
            res.json({status: 'redirect', message: '/admin'})
            return
        }
        if(req.session.user.access_level === 2)
        {
            res.json({status: 'redirect', message: '/moderator'})
            return
        }
        if(req.session.user.access_level === 1)
        {
            res.json({status: 'redirect', message: '/user'})
            return
        }
        res.json({status: 'failed', message: 'Unknown error occured'})
        return
    }
    else
    {
        next()
    }
}

router.post('/login', isNotLogged, (req, res, next) => {
    User.find({email: req.body.email}).exec().then(result => {
        if(result)
        {
            if(bcrypt.compareSync(req.body.password, result.password))
            {
                result.password = null
                req.session.user = result
                res.json({status: 'success', message: result})
            }
            else
            {
                res.json({status: 'failed', message: 'Wrong username or password'})
            }
        }
        else
        {
            res.json({status: 'failed', message: 'Wrong username or password'})
        }
    }).catch(err=>{console.log(err); res.json({status: 'failed', message: err.message})})
})

router.post('/register', isNotLogged, (req, res, next) => {
    
})

module.exports = router