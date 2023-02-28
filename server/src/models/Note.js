const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  docName: { type: String, required: true, default: 'Untitled' },
  // owner: {type: Schema.Types.ObjectId, ref: 'User'},
  owner: { type: String, required: true },
  collabs: { type: Array, required: false },
  createdAt: { type: Date, required: false, default: Date.now },
  lastModified: { type: Date, required: false, default: Date.now },
  contents: { type: Schema.Types.Mixed, required: false },
});

module.exports = mongoose.model('Note', NoteSchema);
