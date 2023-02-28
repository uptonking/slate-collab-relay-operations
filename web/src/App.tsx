import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { NoteEditor } from './components/NoteEditor';
import { UserHome } from './components/UserHome';
import { Header } from './components/Header';
import { Container } from '@material-ui/core';
const App = () => {
  return (
    <Container>
      <BrowserRouter>
        <Route path='/' component={Header} />
        <Route exact path='/' component={UserHome} />
        {/* implement restriction on the path /note/:id later acc to for user 'X' show only the notes of 'X' 
          rn....just implement that for user 'X' either show all notes or dont show...acc to whether authenticated or not.
          */}
        <Route path='/note/:id' component={NoteEditor} />
      </BrowserRouter>
    </Container>
  );
};

export default App;
