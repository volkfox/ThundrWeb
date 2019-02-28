import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

const randBetween = (from, to) => (Math.floor(Math.random() * to) + from);

const Postit = (props) => {

  const firebase = props.db;
  const key = props.k;
  const session = props.session;
  const noteRef = firebase.database().ref(session+'/messages/'+key);
  const messageRef = firebase.database().ref(session+'/messages/'+key+'/text');

  const [positionX, setPositionX] = useState(randBetween(0, window.innerWidth/1.5));
  const [positionY, setPositionY] = useState(randBetween(0, window.innerHeight/2));
  const [angle, setAngle] = useState(randBetween(-10,20));

  const [noteMode, setNoteMode] = useState(0);
  const [text, setText] = useState("");
  useEffect( () => {
    messageRef.once('value').then(function(snapshot) {
      setText(snapshot.val());
    });
  },[]);

  const delNote = () => noteRef.remove();
  const inputEl = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    messageRef.set(e.target.value);
  }

  const editNote = () => {
    // `current` points to the mounted text input element
    setNoteMode(1);
    //inputEl.current.focus();
  };

  return(
    <Draggable
          axis="both"
          handle=".handle"
          defaultPosition={{x: positionX, y: positionY}}
          position={null}
          grid={[10, 10]}
          scale={1}
          disabled={!!noteMode}
          >
          <div className='handle' style={{position: 'absolute'}}>
           <div className="note" style={{transform: 'rotate( '+ angle +'deg)'}}>
             <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                <div className='delete' onClick={delNote}>✕</div>
                <div className='edit' onClick={editNote}>✎</div>
            </div>

            {noteMode ? (<textarea
                           placeholder={'Must be a note here'}
                           rows = "15"
                           cols = "33"
                           margin = "5px"
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
