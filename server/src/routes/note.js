const express = require('express');
const noteRouter = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');
const { ensureAuth } = require('../helpers/auth');
const nodemailer = require('nodemailer');

const initialEditorValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
];

// nodemailer config
let transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.mailuser, // generated ethereal user
    pass: process.env.mailpass, // generated ethereal password
  },
});

// post request to create a Note
// noteRouter.post("/document/create", ensureAuth, async (req, res) => {
noteRouter.post('/document/create', async (req, res) => {
  const note = new Note({
    // owner: req.body.user,
    owner: req.body.user.email,
    collabs: [req.body.user.email],
    contents: initialEditorValue,
    docName: req.body.docName,
  });
  // console.log(';; createNote', note)

  try {
    let result = await note.save();
    // console.log(';; saved ', await Note.find({}))
    res.json({
      message: 'Document created successfully',
      data: result,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Server error while creating document',
      data: err,
      success: false,
    });
  }
});

//get specific note
// noteRouter.get('/document/:docId', ensureAuth, async (req,res)=>{
noteRouter.get('/document/:docId', async (req, res) => {
  try {
    const docId = req.params.docId;

    // const result = await Note.findOne({ $and: [{ _id: docId }, { collabs: req.user.email }] })
    const result = await Note.findOne({ $and: [{ _id: docId }] });

    if (!result) {
      res.status(404).json({
        message: 'Not found Note with Note ID: ' + req.params.docId,
        data: [],
        success: false,
      });
    } else
      res.json({
        message: 'Search completed successfully',
        data: result,
        success: true,
      });
  } catch (err) {
    if (err.kind == 'ObjectId')
      res
        .status(404)
        .json({ message: 'Not found Post with Post ID: ' + req.params.docId });
    else
      res
        .status(500)
        .json({
          message: err || 'Some kind of error while retrieving the Note!',
        });
  }
});

// get notes for a user
// noteRouter.get('/document', ensureAuth, async(req,res)=>{
noteRouter.post('/documents', async (req, res) => {
  // console.log(';; allDocs ', req.body, req.body.user)

  try {
    // const Notes = await Note.find({ owner: req.body.user });
    // const userNotes = await Note.find({ owner: req.body.user.email });
    const userNotes = await Note.find({});
    // console.log(';; qry-notes ', req.body.user.email, userNotes);
    res.json({
      message: 'successfully found notes',
      data: userNotes,
      success: true,
    });
  } catch (err) {
    // console.error(';; allDocs-err ', req.body, req.body.user.email, err)
    res
      .status(500)
      .json({ message: err + 'Some error occurred while retrieving posts.' });
  }
});

// delete a specific note
// noteRouter.delete('/document/:docId', ensureAuth, async (req,res)=>{
noteRouter.delete('/document/:docId', async (req, res) => {
  const deletedNote = await Note.findByIdAndRemove(req.params.docId);
  try {
    if (!deletedNote) {
      res
        .status(404)
        .json({ message: 'Note not found with ID: ' + req.params.docId });
    } else {
      res.json({ message: 'Note deleted with ID: ' + req.params.docId });
    }
  } catch (err) {
    if (err.kind == 'ObjectId') {
      res
        .status(404)
        .json({ message: 'Note not found with ID: ' + req.params.docId });
    } else {
      res
        .status(500)
        .json({
          message: err || 'Some kind of error while deleting the note!',
        });
    }
  }
});

// endpoint to add collaborator
// noteRouter.patch('/document/addcollab/:docId', ensureAuth, async(req,res)=>{
noteRouter.patch('/document/addcollab/:docId', async (req, res) => {
  // req.user={userName:u1,email:'u1@qq.com'}

  // Validate Request
  if (!req.body) res.status(400).json({ message: 'No collab, body is empty!' });

  let mailOptions = {
    from: `${req.user.userName} <test@metanoia.com>`, // sender address
    to: `${req.body.collab}`, // list of receivers
    subject: 'Invitation to Collaborate on a Note', // Subject line
    text: `Hello this is an automated mail from Metanoia on the behalf of user: ${req.user.userName} inviting you to collaborate on a Note http://localhost:3000/note/${req.params.docId}`, // plain text body
    html: `<b>Hello this is an automated mail from Metanoia on the behalf of user: ${req.user.userName} inviting you to collaborate on a <a href="http://localhost:3000/note/${req.params.docId}">Note </a></b>`, // html body
  };

  // transporter.sendMail(mailOptions, (err, info) => {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   console.log("Message sent: %s", info.messageId);
  // });

  // Find post and update it with the request body
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.docId,
    { $push: { collabs: req.body.collab } },
    { new: true },
  );

  try {
    if (!updatedNote) {
      res
        .status(404)
        .json({ message: 'Note not found with ID: ' + req.params.docId });
    } else
      res.json({
        collab: updatedNote.collabs,
      });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      res
        .status(404)
        .json({ message: 'Note not found with ID: ' + req.params.docId });
    } else {
      res
        .status(500)
        .json({
          message: err || 'Some kind of error while updating the note!',
        });
    }
  }
});

module.exports = noteRouter;
