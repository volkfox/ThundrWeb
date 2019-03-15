import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import thumb from '../thumb0.svg';

const randBetween = (from, to) => (Math.floor(Math.random() * to) + from);

const Postit = (props) => {

  const firebase = props.db;
  const key = props.k;
  const session = props.session;
  const noteRef = firebase.database().ref(session+'/messages/'+key);
  const messageRef = firebase.database().ref(session+'/messages/'+key+'/text');
  const votesRef = firebase.database().ref(session+'/votes');
  const posXRef = firebase.database().ref(session+'/messages/'+key+'/posX');
  const posYRef = firebase.database().ref(session+'/messages/'+key+'/posY');

  const [angle, setAngle] = useState(randBetween(-10,20));
  const [noteMode, setNoteMode] = useState(0);
  const [text, setText] = useState("");
  useEffect( () => {
    messageRef.once('value').then(function(snapshot) {
      setText(snapshot.val());
    });
  },[]);

  const positionX = props.posX?props.posX:randBetween(0, window.innerWidth/1.5);
  const positionY = props.posY?props.posY:randBetween(0, window.innerHeight/2);

  var channelClass = "noteBanner" + props.channel;

  const delNote = () => {
    noteRef.remove();
    messageRef.remove();
  }

  const [votes, setVotes] = useState(0);
  useEffect(() => { // Set up vote listeners. Do not run at every re-render.
      votesRef.on('child_added', (data) => {
          const vote = data.val().vote;
          const voteKey = data.val().key;
          if (voteKey === key) {
            setVotes(previous => previous+vote);
          }
      });
      return () => {
        votesRef.off();
      };
  }, []);

  const inputEl = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    messageRef.set(e.target.value);
  }

  const editNote = () => {
    // `current` points to the mounted text input element
    //
    setNoteMode(1);
    //inputEl.current.focus();
  };

  const draggableEventHandler = (e, data) => {
    posXRef.set(data.x);
    posYRef.set(data.y);
  }

  return(
 <Draggable
          axis = "both"
          handle = ".handle"
          defaultPosition = {{x: positionX, y: positionY}}
          position = {null}
          grid = {[10, 10]}
          scale = {1}
          onStop = {draggableEventHandler}
          disabled = {!!noteMode}
          >

          <div className='handle' style={{position: 'absolute'}}>
           <div className="note" style={{transform: 'rotate( '+ angle +'deg)'}}>
           <div className={channelClass}>
             <div className="controls" style={{display: 'flex'}}>
                <div className='edit' onClick={editNote}>✎</div>
                <img alt='vote icon' src={thumb} className="thumbButton"/>
                <div className='votes' >{votes}</div>

                <div className='delete' onClick={delNote}>✕</div>
                </div>



            </div>

            {noteMode ? (<textarea
                           placeholder={'Must be a note here'}
                           autoFocus
                           rows = "12"
                           cols = "40"
                           value = {text}
                           className = "noteInput"
                           disabled = {noteMode?"":"disabled"}
                           onChange = {handleChange}
                           type= "text"
                           ref={inputEl}
                           onBlur = { () => {
                             setNoteMode(0);
                           }}>
                        </textarea> ) : (<div className='text' >{text}</div>)
            }
           </div>
          </div>
    </Draggable>
  )

};

export default Postit;
