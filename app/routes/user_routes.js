const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const User = require('../models/user')
const Song = require('../models/song')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

// instantiate a router (mini app that only handles routes)
const router = express.Router()
// 		function getUserWithMyList(user){
// 			return User.findOne({ user: user })
// 			  .populate('myList').exec((err, myList) => {
// 				console.log("Populated User " + myList);
// 			  })
// 		  }
// 		  getUserWithMyList()
		

// SIGN UP
// POST /sign-up
router.post('/sign-up', (req, res, next) => {
	// start a promise chain, so that any errors will pass to `handle`
	Promise.resolve(req.body.credentials)
		// reject any requests where `credentials.password` is not present, or where
		// the password is an empty string
		.then((credentials) => {
			if (
				!credentials ||
				!credentials.password ||
				credentials.password !== credentials.password_confirmation
			) {
				throw new BadParamsError()
			}
		})
		// generate a hash from the provided password, returning a promise
		.then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
		.then((hash) => {
			// return necessary params to create a user
			return {
				email: req.body.credentials.email,
				// I ADDED THIS LINE// MOVE TO ANOTHER ROUTE////
				// name: req.body.credentials.name,
				///////////////
				hashedPassword: hash,
			}
		})
		// create user with provided email and hashed password
		.then((user) => User.create(user))
		// send the new user object back with status 201, but `hashedPassword`
		// won't be send because of the `transform` in the User model
		.then((user) => res.status(201).json({ user: user.toObject() }))
		// pass any errors along to the error handler
		.catch(next)
})

// SIGN IN
// POST /sign-in
router.post('/sign-in', (req, res, next) => {
	const pw = req.body.credentials.password
	let user

	// find a user based on the email that was passed
	User.findOne({ email: req.body.credentials.email })
		.populate('myList')
		.then(handle404)
		.then((record) => {
			// if we didn't find a user with that email, send 401
			if (!record) {
				throw new BadCredentialsError()
			}
			// save the found user outside the promise chain
			user = record
			// `bcrypt.compare` will return true if the result of hashing `pw`
			// is exactly equal to the hashed password stored in the DB
			return bcrypt.compare(pw, user.hashedPassword)
		})
		.then((correctPassword) => {
			// if the passwords matched
			if (correctPassword) {
				// the token will be a 16 byte random hex string
				const token = crypto.randomBytes(16).toString('hex')
				user.token = token
				// save the token to the DB as a property on user
				return user.save()
			} else {
				// throw an error to trigger the error handler and end the promise chain
				// this will send back 401 and a message about sending wrong parameters
				throw new BadCredentialsError()
			}
		})
		.then((user) => {
			// return status 201, the email, and the new token
			res.status(201).json({ user: user.toObject() })
		})
		.catch(next)
})

// CHANGE password
// PATCH /change-password
router.patch('/change-password', requireToken, (req, res, next) => {
	let user
	// `req.user` will be determined by decoding the token payload
	User.findById(req.user.id)
		// save user outside the promise chain
		.then((record) => {
			user = record
		})
		// check that the old password is correct
		.then(() => bcrypt.compare(req.body.passwords.old, user.hashedPassword))
		// `correctPassword` will be true if hashing the old password ends up the
		// same as `user.hashedPassword`
		.then((correctPassword) => {
			// throw an error if the new password is missing, an empty string,
			// or the old password was wrong
			if (!req.body.passwords.new || !correctPassword) {
				throw new BadParamsError()
			}
		})
		// hash the new password
		.then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
		.then((hash) => {
			// set and save the new hashed password in the DB
			user.hashedPassword = hash
			return user.save()
		})
		// respond with no content and status 200
		.then(() => res.sendStatus(204))
		// pass any errors along to the error handler
		.catch(next)
})

////////////////////////
// Add a song to users repertoire
////////////////////////
// PATCH /user/<song_id>/<user_id>
router.patch('/user/:songId/:userId', requireToken, removeBlanks, (req, res, next) => {
    // get the service and the user ids saved to variables
    const songId = req.params.songId
    const userId = req.params.userId
	// let songList;
	Song.findById(songId)
		.then(handle404)
		.then(song => {
			// console.log('here is song', song)
			// songList = song
			// // console.log('here is the songList', songList)
			// return;
			req.user.myList.push(song)
            console.log('here is the user after the push', req.user)
            return req.user.save()
		})
		.catch(next)
		// function getUserWithMyList(user){
		// 	return User.findOne({ user: user })
		// 	  .populate('myList').exec((err, myList) => {
		// 		console.log("Populated User " + myList);
		// 	  })
		//   }
		//   getUserWithMyList()
		
    // find our User
    // User.findById(userId)
	// 	// .populate('myList')
    //     .then(handle404)
    //     .then(user => {
    //         // user.myList.push(songList)
    //         console.log('here is the user after the push', user)
    //         return user.save()
    //     })
    //     .then(() => res.sendStatus(204))
    //     .catch(next)
})
////////////////////////
// Add a song to users repertoire
////////////////////////
// DELETE /user/<song_id>/<user_id>
router.delete('/user/:songId/:userId', requireToken, removeBlanks, (req, res, next) => {
    const songId = req.params.songId
    // const userId = req.user._id
	// console.log(here is the )
	Song.findById(songId)
		.then(handle404)
		.then(song => {
			req.user.myList.remove(song)
            console.log('here is the user after the push', req.user)
            return req.user.save()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})
// UPDATE
// PATCH /songs/5a7db6c74d55bc51bdf39793
// router.patch('/songs/:id', requireToken, removeBlanks, (req, res, next) => {
// 	// if the client attempts to change the `owner` property by including a new
// 	// owner, prevent that by deleting that key/value pair
// 	delete req.body.song.owner

// 	Song.findById(req.params.id)
// 		.then(handle404)
// 		.then((song) => {
// 			// pass the `req` object and the Mongoose record to `requireOwnership`
// 			// it will throw an error if the current user isn't the owner
// 			requireOwnership(req, song)

// 			// pass the result of Mongoose's `.update` to the next `.then`
// 			return song.updateOne(req.body.song)
// 		})
// 		// if that succeeded, return 204 and no JSON
// 		.then(() => res.sendStatus(204))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })
router.delete('/sign-out', requireToken, (req, res, next) => {
	// create a new random token for the user, invalidating the current one
	req.user.token = crypto.randomBytes(16)
	// save the token and respond with 204
	req.user
		.save()
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
