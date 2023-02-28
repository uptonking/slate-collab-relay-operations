const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const dotenv = require('dotenv');
const Note = require('./models/Note');
const bodyParser = require('body-parser');
const passport = require('passport');

const cookieSession = require('cookie-session');

const PORT = 4000 || process.env.PORT;

dotenv.config({ path: './.env' });

// const passportSetup = require('./config/auth');

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // credentials: true
  }),
);

const connectDB = require('./config/dbconfig');

connectDB();

app.use(express.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    // keys: [process.env.cookieKey]
    keys: '[process.env.cookieKey]',
  }),
);

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', require('./routes/note'));
app.use('/', require('./routes/user'));

// const checkAuth = (req, res, next) => {
//   if (!req.user) {
//     res.status(401).json({
//       authenticated: false,
//       message: "user has not been authenticated"
//     });
//   } else {
//     next();
//   }
// };

app.get('/', (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: 'user successfully authenticated',
    user: req.user,
    cookies: req.cookies,
  });
});

/**
 * Socket Server
 */

// When user connects to socket
io.on('connection', (socket) => {
  // Let client join room represented by doc ID
  socket.on('join', async (room, user) => {
    // console.log(';; join ', user, room)
    try {
      const result = await Note.findById(room);
      if (!result) {
        socket.emit('failed');
        socket.off();
      }
      socket.join(room);
      socket.emit('joined', room);
      socket.activeRoom = room;
    } catch (err) {
      console.log(err);
    }
  });

  // When new text changes received, broadcast new text to all sockets except
  // originator
  socket.on('text-changed', (data) => {
    const room = data.docId;
    socket.to(room).broadcast.emit('text-changed', {
      newText: data.newText,
      ops: data.ops,
    });
  });

  //save the document when the save document button is clicked
  socket.on('save', (data) => {
    Note.findByIdAndUpdate(
      data.docId,
      { $set: { contents: data.newText } },
      { new: true },
    )
      // send updated doc back to other sockets in same room
      .then((updatedDoc) => {
        console.log('saved document successfully');
      })
      .catch((err) => {
        console.log('error saving doc');
        console.log(err);
      });
  });
});

http.listen(PORT, function () {
  console.log(`listening on: http://localhost:${PORT}`);
});
