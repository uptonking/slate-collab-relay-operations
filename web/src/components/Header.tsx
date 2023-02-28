import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { IUser } from '../types/User';
import { Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
export const Header: React.FC = () => {
  // @ts-ignore fix-types
  const { user } = useContext(UserContext);

  const _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open('http://localhost:4000/auth/google', '_self');
  };

  const _handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open('http://localhost:4000/auth/logout', '_self');
  };

  return (
    <div className='container'>
      {user ? (
        <>
          {/* <Avatar alt="Remy Sharp" src={user.thumbnail} />
                        <h3>{user.userName}</h3> 
                        <Button variant="contained" color="primary" onClick={_handleLogoutClick}>Log Out</Button> */}
          <header>
            <div className='inner-header'>
              <Link to={`/`}>
                <Avatar alt='Remy Sharp' src={user.thumbnail} />
              </Link>
              <h3>{user.userName}</h3>
              <div className='navigation'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={_handleLogoutClick}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </header>
        </>
      ) : (
        <header>
          <div className='inner-header'>
            <div className='logo'>
              <Link to='/'> Slate Collab </Link>
            </div>
            <div className='navigation'>
              {/* <a href='#'>FAQ</a> */}
              <a href='#' onClick={_handleSignInClick}>
                Log in
              </a>
            </div>
          </div>
        </header>
      )}
    </div>
  );
};
