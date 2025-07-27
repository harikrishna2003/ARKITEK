import { useState, useEffect } from 'react';
import {
  HtmlEditor, Inject, RichTextEditorComponent, Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Notepad() {
  const { projectId } = useParams();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState('');

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  const API = `http://localhost:3000/projects/${projectId}/notes`;

  useEffect(() => {
    axios.get(API,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
        .then(res => {
      setNotes(res.data);
      if (res.data.length > 0) setActiveNoteId(res.data[0]._id);
    });
  }, [projectId]);

  const activeNote = notes.find((note) => note._id === activeNoteId);

const saveNote = async (note) => {
  let res;
  if (note._id) {
    res = await axios.put(`${API}/${note._id}`, note,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
  } else {
    res = await axios.post(API, note,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
  }

  setNotes(prev => {
    const idx = prev.findIndex(n => n._id === res.data._id);
    if (idx !== -1) {
      const updated = [...prev];
      updated[idx] = res.data;
      return updated;
    }
    return [res.data, ...prev];
  });
};


  const deleteNote = async (id) => {
    await axios.delete(`${API}/${id}`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
    const updated = notes.filter(n => n._id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length ? updated[0]._id : null);
    }
  };

  const handleContentChange = (e) => {
    const content = e.value;
    const note = notes.find(n => n._id === activeNoteId);
    if (note) {
      const updated = { ...note, content };
      saveNote(updated);
    }
  };

  const addNewNote = async () => {
    const newNote = {
      title: 'New Note',
      content: '<h2>Title</h2><p>Write your text here...</p>',
    };
    const res = await axios.post(API, newNote,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
    setNotes([res.data, ...notes]);
    setActiveNoteId(res.data._id);
    setEditingTitleId(res.data._id);
    setTitleInput(res.data.title);
  };

  const startEditingTitle = (id, title) => {
    setEditingTitleId(id);
    setTitleInput(title);
  };

  const finishEditingTitle = async () => {
    if (titleInput.trim() !== '') {
      const note = notes.find(n => n._id === editingTitleId);
      if (note) {
        const updated = { ...note, title: titleInput.trim() };
        await saveNote(updated);
      }
    }
    setEditingTitleId(null);
  };

  const toolbarSettings = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|', 'Print', 'FullScreen']
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e1e' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', padding: '1rem', backgroundColor: '#111827', color: '#fff' }}>
        {role === "admin" && (
        <button
          onClick={addNewNote}
          style={{
            backgroundColor: '#ff6a00',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginBottom: '1rem',
            color: '#fff',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          + Add New
        </button>
          
        )}

        {notes.map((note) => (
          <div
            key={note._id}
            style={{
              backgroundColor: note._id === activeNoteId ? '#2a3b4c' : 'transparent',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            {editingTitleId === note._id ? (
              <input
                value={titleInput}
                autoFocus
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={finishEditingTitle}
                onKeyDown={(e) => e.key === 'Enter' && finishEditingTitle()}
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  width: '100%',
                  marginRight: '0.5rem'
                }}
              />
            ) : (
              <div
                style={{ flex: 1 }}
                onClick={() => {
                  setActiveNoteId(note._id);
                  if (note._id === activeNoteId) startEditingTitle(note._id, note.title);
                }}
              >
                {note.title}
              </div>
            )}

            {note._id === activeNoteId && (
              <span
                onClick={() => deleteNote(note._id)}
                title="Delete"
                style={{
                  color: '#ff6a00',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🗑️
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        {activeNote ? (
          <RichTextEditorComponent
            height='100%'
            width='100%'
            value={activeNote.content}
            toolbarSettings={toolbarSettings}
            change={handleContentChange}
          >
            <Inject services={[Toolbar, HtmlEditor]} />
          </RichTextEditorComponent>
        ) : (
          <div style={{ color: '#ccc', padding: '2rem' }}>No note selected.</div>
        )}
      </div>
    </div>
  );
}

export default Notepad;
