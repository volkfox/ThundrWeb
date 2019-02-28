import React from 'react';
import logo from '../logo.svg';
import {Link} from 'react-router-dom'


const Home = (props) => {

  const firebase = props.db;
  firebase.database().ref('/'+props.code+'/channel').set(0);
  firebase.database().ref('/'+props.code+'/mode').set(0);
  firebase.database().ref('/'+props.code+'/votes').set(0);
  firebase.database().ref('/'+props.code+'/messages').set(0);

  return (<div className="App">
    <header className="App-header">
      <Link to={"/session/" + props.code}>
        <img src={logo} className="App-logo" alt="logo"/>
      </Link>

      <p>
        Thundr: ideas without paper
      </p>
      <Link style={{
          textDecoration: 'none',
          color: 'crimson'
        }} to={"/session/" + props.code}>Launch new brainstorm</Link>
    </header>
  </div>);
}

export default Home;
