const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema(
	{
		url: {
			type: String,
		},

	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Upload', uploadSchema)
