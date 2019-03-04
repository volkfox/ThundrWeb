import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { QRCode } from "react-qr-svg";
import Postit from './Postit.js'
import button from '../button.jpeg';



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

  const [channel, setChannel] = useState(0);
  useEffect(() => { // updates DB every time channel changes by tab switching
    const channelRef = firebase.database().ref(session + '/channel');
    channelRef.set(channel);
  }, [channel]);

  const [mode, setMode] = useState(false);
  useEffect(() => { // updates DB every time mode changes by vote button
    const modeRef = firebase.database().ref(session + '/mode');
    modeRef.set(mode);
  }, [mode]);

  const commentsRef = firebase.database().ref(session+ '/messages');
 const banner = "banner" + channel;
  
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
}, 

  []);

  return (
    <div>

    <script>

console.log("hi");
    </script>

    <div className = "headerSession">  
      <div className = "code"> <b> Code: {session} </b> </div>      
      <div id="qr">
             <QRCode
                   bgColor="#FFFFFF"
                   fgColor="#000000"
                   level="Q"
                   style={{ width: 200 }}
                   value={'com.thundr://session?code='+session}
               />
           </div> 

            <img src={button} id="addTabButton" />

              <div className="tabParent">
                <div id="tab">
                  <Tabs defaultIndex={0} onSelect={index => setChannel(index)}>
                    <TabList>
                      

                      <Tab> Brainstorm One</Tab>
                      <Tab>  Brainstorm Two</Tab>
                      <Tab>Brainstorm Three</Tab>

                    

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
                </Tabs>
              </div>
        </div> 
    </div>
    

    <div className = {banner}> 
             <button type="button"
                   className="voteButton"
                   onClick={ () => setMode(previous => !previous)}
                   style={{backgroundColor: mode? "#9556FB":"#E3D2FF"}}
                   >
                   {mode?("Switch to Idea Mode"):("Switch to Vote Mode")}
          </button>
    </div>
    
    
      

  </div>
 );

};

export default Session;
