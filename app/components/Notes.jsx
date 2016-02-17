import React from 'react';
import Note from './Note.jsx';

export default ({notes}) => {
  return (
    <ul className="notes">{notes.map((note) =>
	<li className="note" key={note.id} >
	  <Note className="note" key={note.id} note={note} />
	</li>
    )}</ul>
  );
}
