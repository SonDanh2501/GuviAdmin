import React from 'react';
import { Container, Fab } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Header from '../components/Header';
import UserManage from '../components/Customer/UserManage.jsx';
import  * as actions from '../redux/actions/customerAction';

export default function HomePage() {
 
  
  return (
    <Container maxWidth='md'>
      <Header />
      <UserManage/>
    
    </Container>
  );
}
