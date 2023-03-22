import React from 'react';
import NavBar from '../components/NavBar';
import Rooms from '../components/rooms/Rooms';
import Login from '../components/user/Login';

const Home = () => {
  return (
    <>
      <Login />
      <NavBar />
      <Rooms />
    </>
  );
};

export default Home;
