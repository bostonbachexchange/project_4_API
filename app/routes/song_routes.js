// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for songs
const User = require('../models/user')
const Song = require('../models/song')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET ALL SONGS 
router.get('/songs', (req, res, next) => {
	Song.find()
		.then((songs) => {
			// `songs` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return songs.map((song) => song.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((songs) => res.status(200).json({ songs: songs }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /songs/5a7db6c74d55bc51bdf39793
router.get('/songs/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Song.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "song" JSON
		.then((song) => res.status(200).json({ song: song.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /create-song
router.post('/create-song', requireToken, (req, res, next) => {
	// set owner of new song to be current user
	req.body.song.owner = req.user.id

	Song.create(req.body.song)
		// respond to succesful `create` with status 201 and JSON of new "song"
		.then((song) => {
			res.status(201).json({ song: song.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /songs/5a7db6c74d55bc51bdf39793
router.patch('/songs/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.song.owner

	Song.findById(req.params.id)
		.then(handle404)
		.then((song) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, song)

			// pass the result of Mongoose's `.update` to the next `.then`
			return song.updateOne(req.body.song)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /songs/5a7db6c74d55bc51bdf39793
router.delete('/songs/:id', requireToken, (req, res, next) => {
	Song.findById(req.params.id)
		.then(handle404)
		.then((song) => {
			// throw an error if current user doesn't own `example`
			requireOwnership(req, song)
			// delete the example ONLY IF the above didn't throw
			song.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
