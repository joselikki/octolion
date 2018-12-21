const express = require('express')
const passport = require('passport')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const api = express.Router()

const { config } = require('../../config')

//BASIC STRATEGY

require('../../utils/auth/strategies/basic')    

api.post("/token", async function (req, res, next) {
    passport.authenticate("basic", (error, user)=>{
        try{
            if(error || !user){
                next(boom.unauthorized)
            }

            req.login(user, { session: false}, async function(error){
                if(error){
                    next(error)
                }

                const payload = { sub: user.name, email: user.email }
                const token = jwt.sign(payload, config.authAdminJwtSecret,{
                    expiresIn: "15m"
                })

                return res.status(200).json({ acces_token: token })
            })
        } catch(error) {
            next(error)
        }
    })(req, res, next)
})

module.exports = api