const mongoose = require('mongoose')
const { Schema, model } = mongoose
const user = require('./user')

const commentSchema = new Schema(
	{
		name: {
			type: String,
			ref: 'User',
		},
		content: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
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

module.exports = model('comment', commentSchema)
