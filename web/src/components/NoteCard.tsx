import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from '@material-ui/core';
import { Delete, Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    //Typescript ways of adding the type
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString([], options);
};

export const NoteCard: React.FC<any> = ({ note }) => {
  // @ts-ignore fix-types
  const { user } = useContext(UserContext) as IUser;

  const [collaborator, setCollaborator] = useState<string>();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (noteId) => {
    setOpen(false);
    addCollaborator(noteId, collaborator);
  };

  const handleDelete = async (noteId) => {
    await fetch(`http://localhost:4000/document/${noteId}`, {
      method: 'DELETE',
      // credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });
  };

  const addCollaborator = async (noteId, collab) => {
    console.log(collab);
    // send mail to collaborator with the accept url which is basically http://localhost:4000/document/addCollab/:noteId
    await fetch(`http://localhost:4000/document/addCollab/${noteId}`, {
      method: 'PATCH',
      // credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collab: collab, user }),
    });
  };

  return (
    <div className='notecard'>
      <Card>
        <CardContent>
          <Link to={`/note/${note._id}`}>
            <Typography gutterBottom variant='h5' component='h2'>
              {note.docName}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {formatDate(note.createdAt)}
            </Typography>
          </Link>
          <CardActions>
            <IconButton
              onClick={() => handleDelete(note._id)}
              aria-label='delete'
            >
              <Delete />
            </IconButton>
            <IconButton onClick={() => handleClickOpen()} aria-label='delete'>
              <Add />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle id='alert-dialog-title'>
                {'Add a Collaborator: '}
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin='dense'
                  id='collab'
                  label='Collaborator Email'
                  type='collab'
                  fullWidth
                  onChange={(e) => setCollaborator(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color='primary'>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmit(note._id)}
                  color='primary'
                  autoFocus
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
};
