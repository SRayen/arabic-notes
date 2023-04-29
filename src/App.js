import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";
import Preview from "./components/Preview";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState({
    id: "",
    title: "",
    content: "",
  });
  // const [Create, setCreate] = useState(false);
  const [showMode, setShowMode] = useState("Preview");
  const [editing, setEditing] = useState(false);

  // GET FROM LOCAL STORAGE
  useEffect(() => {
    const json = localStorage.getItem("notes");
    const loadedNotes = JSON.parse(json);
    if (loadedNotes) {
      setNotes(loadedNotes);
    }
  }, []);

  // SET TO LOCAL STORAGE
  useEffect(() => {
    if (notes.length > 0) {
      const json = JSON.stringify(notes);
      localStorage.setItem("notes", json);
    }
  }, [notes]);

  // DELETE NOTE
  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    setSelectedNote(notes[0]);
  };

  //SAVE EDITED NOTE
  const saveEditedNoteHandler = () => {
    const updatedNotes = [
      ...notes.filter((note) => note.id != selectedNote.id),
      selectedNote,
    ];
    setNotes(updatedNotes);
    setShowMode("Preview");
  };

  const getAddNote = () => {
    return (
      <div>
        <h2>إضافة ملاحظة جديدة</h2>
        <div>
          <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="العنوان"
            value={title}
            onChange={changeTitleHandler}
          />

          <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder="النص"
            value={content}
            onChange={changeContHandler}
          />

          <a href="#" className="button green" onClick={saveNoteHandler}>
            حفظ
          </a>
          <span> </span>
          <a href="#" className="button green" onClick={()=>setShowMode('Preview')}>
            عودة
          </a>
        </div>
      </div>
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <h2>لا يوجد ملاحظة</h2>;
    }

    if (!selectedNote.id) {
      return <h2>الرجاء اختيار ملاحظة</h2>;
    }

    const note = notes.find((note) => note.id === selectedNote.id);
    if (note) {
      return (
        <div>
          <div className="note-operations">
            <a href="#" onClick={() => setShowMode("Edit")}>
              <FontAwesomeIcon icon={faPencil} />
            </a>
            <a href="#" onClick={() => deleteNote(note.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </a>
          </div>
          <div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        </div>
      );
    }
  };

  const getEditNote = (id) => {
    return (
      <div>
        <h2>تحيين ملاحظة </h2>
        <div>
          <input
            type="text"
            name="EitedTitle"
            className="form-input mb-30"
            placeholder="العنوان"
            value={selectedNote.title}
            onChange={(e) =>
              setSelectedNote((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <textarea
            rows="10"
            name="EditedContent"
            className="form-input"
            placeholder="النص"
            value={selectedNote.content}
            onChange={(e) =>
              setSelectedNote((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          <a href="#" className="button green" onClick={saveEditedNoteHandler}>
            تحيين
          </a>
        </div>
      </div>
    );
  };

  const addNoteHandler = () => {
    setShowMode("Create");
  };

  const changeTitleHandler = (e) => {
    setTitle(e.target.value);
  };

  const changeContHandler = (e) => {
    setContent(e.target.value);
  };

  const saveNoteHandler = () => {
    const note = {
      id: new Date(),
      title: title,
      content: content,
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    setShowMode("Preview");
    setSelectedNote(note);

    setTitle("");
    setContent("");
  };

  console.log(selectedNote);

  return (
    <div className="App">
      <div className="notes-section">
        <ul className="notes-list">
          {notes.map((note) => {
            return (
              <li
                className="note-item"
                key={note.id}
                onClick={() => setSelectedNote(note)}
              >
                {note.title}
              </li>
            );
          })}
        </ul>
        <button className="add-btn" onClick={addNoteHandler}>
          +
        </button>
      </div>
      <Preview>
        {showMode === "Create"
          ? getAddNote()
          : showMode === "Preview"
          ? getPreview()
          : getEditNote()}
      </Preview>
    </div>
  );
}

export default App;
