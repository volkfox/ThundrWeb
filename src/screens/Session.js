import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { QRCode } from "react-qr-svg";
import Postit from './Postit.js'
import trash from '../Trash.svg';

//style={{backgroundColor: mode?"white":"white", border: mode?"solid purple 3px":"solid purple 3px"}}

const Session = (props) => {
 

  const match = props.match;
  const session = match.params.id;
  const firebase = props.db;

  const filterNotes = (note, i) => {
     if (note.channel === channel) {
       return (
         <Postit key={note.key} k={note.key} posX={note.posX} posY={note.posY} db={firebase} session={session} channel={note.channel}/>
       );
     }
  };

    const deleteBrainstorm = () => {
    alert("Are you sure you want to delete your brainstorm?");

    //we need some sort of delete functionality here
  }


  const [channel, setChannel] = useState(0);
  useEffect(() => { // updates DB every time channel changes by tab switching
    const channelRef = firebase.database().ref(session + '/channel');
    channelRef.set(channel);
    var x = document.getElementById("voteButton");

        if(mode === false){
        if(channel === 0){
          x.style.backgroundColor = "#7E7DB1";
        }
        if(channel === 1){
          x.style.backgroundColor = "#7DB185";
        }
        if(channel === 2){
          x.style.backgroundColor = "#B17D7D";
        }
         if(channel === 3){
          x.style.backgroundColor = "#7DAAB1"; 
        }
         if(channel === 4){
          x.style.backgroundColor = "#B17DAB";  
        }

      } else {
          if(channel === 0){
          x.style.backgroundColor = "#454899";
        }
         if(channel === 1){
          x.style.backgroundColor = "#386E4A";
        }
        if(channel === 2){
          x.style.backgroundColor = "#843F3F";
        }
         if(channel === 3){
          x.style.backgroundColor = "#396F87";
        }
         if(channel === 4){
          x.style.backgroundColor = "#6F4172";
        }
    }




    
  }, [channel]);

  const [mode, setMode] = useState(false);
  useEffect(() => { // updates DB every time mode changes by vote button
    const modeRef = firebase.database().ref(session + '/mode');
    modeRef.set(mode);
  }, [mode]);

  const commentsRef = firebase.database().ref(session+ '/messages');
  const banner = "banner" + channel;
  const flexV = "flexV" +  channel;


    const clickIt = () => {
      setMode(previous => !previous)
      var x  = document.getElementById("voteButton");
      
      if(mode === true){
        if(channel === 0){
          x.style.backgroundColor = "#7E7DB1";
        }
        if(channel === 1){
          x.style.backgroundColor = "#7DB185";
        }
        if(channel === 2){
          x.style.backgroundColor = "#B17D7D";
        }
         if(channel === 3){
          x.style.backgroundColor = "#7DAAB1"; 
        }
         if(channel === 4){
          x.style.backgroundColor = "#B17DAB";  
        }

      } else {
          if(channel === 0){
          x.style.backgroundColor = "#454899";
        }
         if(channel === 1){
          x.style.backgroundColor = "#386E4A";
        }
        if(channel === 2){
          x.style.backgroundColor = "#843F3F";
        }
         if(channel === 3){
          x.style.backgroundColor = "#396F87";
        }
         if(channel === 4){
          x.style.backgroundColor = "#6F4172";
        }
    }
      
  }


    


  const [messages, setMessages] = useState([]);

  useEffect(() => { // Set up message listeners. Do not run at every re-render.
      commentsRef.on('child_added', (data) => {
          const message = {text: data.val().text,
                           channel: data.val().channel,
                           posX: data.val().posX,
                           posY: data.val().posY,
                           key: data.key
                           };
          setMessages(previous => previous.concat([message]));
      });



      commentsRef.on('child_removed', (data) => {
          setMessages(previous => previous.filter(message => message.key !== data.key));
      });
      commentsRef.on('child_changed', (data) => {
          const message = {text: data.val().text,
                           channel: data.val().channel,
                           posX: data.val().posX,
                           posY: data.val().posY,
                           key: data.key
                           };
          setMessages(previous => previous.filter(el => el.key !== message.key).concat([message]));


      });



      return () => {
        commentsRef.off();
      };

  } , []);

  return (

    <div id="main">

      <div className="flexContainer">
          <div className={flexV}>
           <h2 className="codeC"> <b> Code: {session} </b> </h2>
           <div id="qr">
             <QRCode
                   bgColor="#FFFFFF"
                   fgColor="#000000"
                   level="Q"
                   style={{ width: 180 }}
                   value={'com.thundr://session?code='+session}
               />
           </div>
          </div>
          <div className="brain">

          <div className= {banner}> 

            <Tabs defaultIndex={0} onSelect={index => setChannel(index)}> 
            <TabList>
              <button type="button"
                       id="voteButton"
                       onClick={clickIt}
                       >
                       {mode?("Click to Brainstorm"):("Click to Vote")}
              </button>
             <span className="tabCl">
              <Tab>Brainstorm One</Tab>
              <Tab>Brainstorm Two</Tab>
              <Tab>Brainstorm Three</Tab>
              <Tab>Brainstorm Four</Tab>
              <Tab>Brainstorm Five</Tab>
              </span>
            
            </TabList>

            <TabPanel>
                  {messages.map(filterNotes)}
            </TabPanel>
            <TabPanel>
                  {messages.map(filterNotes)}
            </TabPanel>
            <TabPanel>
                  {messages.map(filterNotes)}
            </TabPanel>
              <TabPanel>
                  {messages.map(filterNotes)}
            </TabPanel>
              <TabPanel>
                  {messages.map(filterNotes)}
            </TabPanel>
          </Tabs>
          </div>
    </div>
  </div>
  
   <img src={trash} onClick={deleteBrainstorm} className="trashcan"/>

  </div>

  
 );

};

export default Session;
