const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LawToken = new Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        shortname: { type: String, required: false }
        // children: { type: Schema.Types.LawToken.id, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('LawToken', LawToken)