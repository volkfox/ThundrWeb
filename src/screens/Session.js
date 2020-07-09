import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { QRCode } from "react-qr-svg";
import Postit from './Postit.js'
import thumb_purple from '../thumb_purple.svg';
import thumb_green from '../thumb_green.svg';
import thumb_pink from '../thumb_pink.svg';
import thumb_blue from '../thumb_blue.svg';
import thumb_cyan from '../thumb_cyan.svg';

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

    console.log(channel);
  }, [channel]);

  const [mode, setMode] = useState(false);
  useEffect(() => { // updates DB every time mode changes by vote button
    const modeRef = firebase.database().ref(session + '/mode');
    modeRef.set(mode);
  }, [mode]);

  const commentsRef = firebase.database().ref(session+ '/messages');
  const banner = "banner" + channel;
  const flexV = "flexV" +  channel;

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
  }, []);

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
          <div className={banner}>
            <Tabs defaultIndex={0} onSelect={index => setChannel(index)}>
            <TabList>
              <button type="button"
                       className="voteButton"
                       onClick={ () => setMode(previous => !previous)}
                       style={{backgroundColor: mode?"red":"white", color: 'white'}}
                       >
                      {mode?("Stop"):(" ")}
                      {!mode && (channel === 0) && <img alt='vote icon' src={thumb_purple} className="thumbButton"/>}
                      {!mode && (channel === 1) && <img alt='vote icon' src={thumb_green} className="thumbButton"/>}
                      {!mode && (channel === 2) && <img alt='vote icon' src={thumb_pink} className="thumbButton"/>}
                      {!mode && (channel === 3) && <img alt='vote icon' src={thumb_blue} className="thumbButton"/>}
                      {!mode && (channel === 4) && <img alt='vote icon' src={thumb_cyan} className="thumbButton"/>}
              </button>

              <span className="tabCl">
              <Tab>Brainstorm 1</Tab>
              <Tab>Brainstorm 2</Tab>
              <Tab>Brainstorm 3</Tab>
              <Tab>Brainstorm 4</Tab>
              <Tab>Brainstorm 5</Tab>
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
  </div>
 );

};

export default Session;
