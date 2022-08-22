const mongoose = require('mongoose')
// const { Schema, model } = mongoose

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
	},
	{
		timestamps: true,
	}
)

module.exports = commentSchema
