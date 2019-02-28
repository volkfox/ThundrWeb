import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { QRCode } from "react-qr-svg";
import Postit from './Postit.js'

const Session = (props) => {

  const match = props.match;
  const session = match.params.id;
  const firebase = props.db;

  const filterNotes = (note, i) => {
     if (note.channel === channel) {
       return (
         <Postit key={note.key} k={note.key} db={firebase} session={session}/>
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

  const [messages, setMessages] = useState([]);
  useEffect(() => { // Set up message listeners. Do not run at every re-render.
      commentsRef.on('child_added', (data) => {
          const message = {text: data.val().text,
                           channel: data.val().channel,
                           key: data.key};
          setMessages(previous => previous.concat([message]));
      });
      commentsRef.on('child_removed', (data) => {
          setMessages(previous => previous.filter(message => message.key !== data.key));
      });
      return () => {
        commentsRef.off();
      };
  }, []);

  console.log(messages);

  return (
    <div id="main">
    <h2>Session: {session} </h2>
      <div className="flexContainer">
          <div className="flexVertical">
           <div id="qr">
             <QRCode
                   bgColor="#FFFFFF"
                   fgColor="#000000"
                   level="Q"
                   style={{ width: 256 }}
                   value={'com.thundr://session?code="'+session+'"'}
               />
           </div>
           <button type="button"
                   className="voteButton"
                   onClick={ () => setMode(previous => !previous)}
                   style={{backgroundColor: mode?"red":""}}
                   >
                   {mode?("Voting"):("Vote")}
          </button>
          </div>
          <div id="brain">
            <Tabs defaultIndex={0} onSelect={index => setChannel(index)}>
            <TabList>
              <Tab>Brainstorm One</Tab>
              <Tab>Brainstorm Two</Tab>
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
 );

};

export default Session;
