const { Schema, model, ObjectId } = require('mongoose')

const User = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    diskSpace: { type: Number, default: 1024 ** 2 * 100 }, // 100 Mb
    usedSpace: { type: Number, default: 0 },
    avatar: { type: String },
    files: [{ type: ObjectId, ref: 'File' }],
}, { versionKey: false })

module.exports = model('User', User)
