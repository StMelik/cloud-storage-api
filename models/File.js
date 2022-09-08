const { model, Schema, ObjectId } = require('mongoose')

const File = new Schema({
    name: { type: String, require: true },
    type: { type: String, require: true },
    accessLink: { type: String },
    size: { type: Number, default: 0 },
    path: { type: String, default: '' },
    date: { type: Date, default: new Date() },
    user: { type: ObjectId, ref: 'User' },
    parent: { type: ObjectId, ref: 'File' },
    childs: [{ type: ObjectId, ref: 'File' }],
}, { versionKey: false })

module.exports = model('File', File)
