import React from 'react';
import logo from '../logo.svg';
import {Link} from 'react-router-dom'
import storm3 from '../storm5.jpeg';
import storm2 from '../stormNG.jpeg';
import button from '../button.jpeg';



const Home = (props) => {

  const firebase = props.db;
  firebase.database().ref('/'+props.code+'/channel').set(0);
  firebase.database().ref('/'+props.code+'/mode').set(0);
  firebase.database().ref('/'+props.code+'/votes').set(0);
  firebase.database().ref('/'+props.code+'/messages').set(0);

  return (<div className = "bg">

      <div className = "header">
               
       <div>
       
       <img src={storm2} className="App-logo" alt="logo"/> 
       
       <span className = "topText">     &nbsp; &nbsp; &nbsp; &nbsp;    
        Thundr </span > 
   
      
        <img src={storm3} className="App-appstore" alt="logo2"/>
      </div>
 

  


      </div>




    

      <div className = "landingBackground">

     <div className = "landingText"><br></br> Introducing Thundr, <br></br> <br></br>a collaborative brainstorming tool 
     that increases productivity by allowing participants to utilize voice interaction 
     technology to record ideas. </div>
   
        <Link to={"/session/" + props.code}> <button className='createButton'> Create Brainstorm </button>  </Link>
        <Link to={"/session/" + props.code}>

      </Link>

      </div>

  </div>);


}

export default Home;
