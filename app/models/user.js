const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
		},
		vocalRange: {
			type: String,
			enum: ['soprano', 'alot', 'tenor', 'base'],
			default: 'soprano'
		},
		myList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
		hashedPassword: {
			type: String,
			required: true,
		},
		token: String,
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
