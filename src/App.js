import React, { Component } from 'react';
import Session from './screens/Session.js';
import Home from './screens/Home.js';
import './App.css';
import 'draft-js/dist/Draft.css';
import randomstring from 'randomstring'

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAZ3_t5WUBasDIBn3CtrNYxAOXn7IN8Jb0",
  authDomain: "voice-test-231101.firebaseapp.com",
  databaseURL: "https://voice-test-231101.firebaseio.com",
  projectId: "voice-test-231101",
  storageBucket: "voice-test-231101.appspot.com",
};

const code = randomstring.generate({length: 6, charset: 'alphabetic'}).toUpperCase();


class App extends Component {
  constructor() {
    super();
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/session/:id"
           render={(props) => <Session {...props} db={firebase} />}
          />
          <Route
            exact path="/"
            render={(props) => <Home {...props} db={firebase} code={code} />}
            />
        </div>
      </Router>
    );
  }
}

export default App;
