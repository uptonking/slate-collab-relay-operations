import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { IUser } from '../types/User';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab';
import { NoteCard } from './NoteCard';

export const UserHome: React.FC = () => {
  // @ts-ignore fix-types
  const { user, setUser } = useContext(UserContext) as IUser;

  const [notes, setNotes] = useState<any>([]);

  const [noteName, setNoteName] = useState<string>('');

  //----------Modal State------------------
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    createNote(noteName);
  };
  //---------------------------------------
  const getNotes = async () => {
    const notesFromServer = await fetchNotes();
    setNotes(
      notesFromServer.data && notesFromServer.data.length
        ? notesFromServer.data
        : null,
    );
    return notesFromServer;
  };

  const fetchNotes = async () => {
    const res = await fetch('http://localhost:4000/documents', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: "include",
      body: JSON.stringify({ user }),
    });
    const data = await res.json();
    return data;
  };

  //function to create a new note
  const createNote = async (noteName) => {
    const res = await fetch('http://localhost:4000/document/create', {
      method: 'POST',
      // credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ docName: noteName, user }),
    });
    const newNote = await res.json();
    if (notes) {
      setNotes([...notes, newNote.data]);
    } else {
      setNotes([newNote.data]);
    }
  };

  // EFfect to get all the notes in the db
  useEffect(() => {
    if (user) {
      getNotes().then((notes) => {
        console.log(';; notes ', notes);
      });
    }
  }, [user]);

  return (
    <div className='container'>
      <br />
      <br />
      <div style={{ display: 'flex' }}>
        <button
          onClick={() => {
            setUser({ userName: 'u11', email: 'u11@qq.com' });
          }}
        >
          user11
        </button>
        <button
          onClick={() => {
            setUser({ userName: 'u12', email: 'u12@qq.com' });
          }}
        >
          user12
        </button>
        <button
          onClick={() => {
            getNotes().then((notes) => {
              console.log(';; notes ', notes);
            });
          }}
        >
          fetchNotes
        </button>
      </div>
      <div>
        {
          // user ?
          <div className='container'>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle id='alert-dialog-title'>
                {'Create a Note: '}
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin='dense'
                  id='note-name'
                  label='Note Name'
                  type='note'
                  fullWidth
                  onChange={(e) => setNoteName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color='primary'>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color='primary' autoFocus>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <br></br>
            <br></br>
            <div>
              {notes ? (
                notes.map((note, index) => <NoteCard note={note} key={index} />)
              ) : (
                <Alert severity='info'>No current notes...</Alert>
              )}
              {user ? (
                <Fab
                  onClick={handleClickOpen}
                  color='primary'
                  aria-label='add'
                  style={{ position: 'absolute', bottom: '10%', right: '25%' }}
                >
                  <AddIcon />
                </Fab>
              ) : null}
            </div>
          </div>
          //   :
          //   (

          // <div className="image-container">
          //   <button onClick={()=>{createNote('note11')}}>create note</button>
          //     {/* <img src="/image1.jpg" className="homepage-image" alt="collaboration"/> */}
          // </div>
          //   )
        }
      </div>
    </div>
  );

  type NoteCardProps = {
    title: string;
  };
};
