const mongoose = require('mongoose')
const { Schema, model } = mongoose

const songSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		composer: {
			type: String,
		},
		lyricist: {
			type: String,
		},
		type: {
			type: String,
		},
		lyrics: {
			type: String,
		},
		scorePDF: {
			type: String,
		},
		recordings: {
			type: String,
		},
		embedId: {
			type: String,
		},
		url: {
			type: String,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = model('Song', songSchema)
