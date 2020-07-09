import React, { useState, useEffect } from 'react';
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
//import logo from '../logo.svg';
import Tbs from './About.js'
import bolt from '../thunder_b.svg';
import bbolt from '../thunderBlack.svg';
import {Link} from 'react-router-dom'

const FLASHES = 4
const MAX_FLASH_INTERVAL = 250
const MIN_FLASH_INTERVAL = 50
const AVERAGE_BETWEEN_FLASHES = 10000

const Home = (props) => {

  const firebase = props.db;
  firebase.database().ref('/'+props.code+'/channel').set(0);
  firebase.database().ref('/'+props.code+'/mode').set(0);
  firebase.database().ref('/'+props.code+'/votes').set(0);
  firebase.database().ref('/'+props.code+'/messages').set(0);

  const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
  }

  const thunderEffect = async () => {
    const flashes = Math.floor(Math.random() * FLASHES + 1);

    for (let i=0; i<flashes; i++) {
      await sleep(Math.floor(Math.random()*MAX_FLASH_INTERVAL+MIN_FLASH_INTERVAL ));
      setLightning(1);
      await sleep(Math.floor(Math.random()*MAX_FLASH_INTERVAL+MIN_FLASH_INTERVAL ));
      setLightning(0);
    }
    setTimeout(thunderEffect, Math.random()*AVERAGE_BETWEEN_FLASHES);
  }


  const [lightning, setLightning] = useState(0);
  useEffect(() => {
    // Update once
    setTimeout(thunderEffect, Math.random()*10000);
  },[]);

  let bgcolor = lightning?'white':'#A6ADE8';
  let textcolor = lightning?'black':'white';
  return (
      <div className="App" >

        <div className="Name"  >
          <p className='logo-paragraph-top' style={{color: textcolor}}>
          thundr
          </p>
          <p className='logo-paragraph'>
            brainstorm with sound
          </p>
        </div>

      { !lightning && <Tbs /> }
    <header className="App-header" style={{backgroundColor: bgcolor}}>


      <Link to={"/session/" + props.code}>
        <img src={lightning?bbolt:bolt} className="App-logo" alt="logo"/>
      </Link>



    </header>
  </div>);
}

export default Home;
