/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { Button, InputGroup, FormControl } from "react-bootstrap";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedNoteId, setHighlightedNoteId] = useState([]);
  const listGroupRef = useRef(null);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const loadedNotes = await loadNotes();
        setNotes(loadedNotes);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  useEffect(() => {
    if (highlightedNoteId.length > 0 && listGroupRef.current) {
      highlightedNoteId.forEach((noteId) => {
        const highlightedNote = listGroupRef.current.querySelector(
          `#note-${noteId}`
        );
        if (highlightedNote) {
          highlightedNote.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [highlightedNoteId]);

  async function loadNotes() {
    return API.get("notes", `/notes?search=${searchTerm}`);
  }

  async function deleteNotesWithCommonWord() {
    const notesToDelete = notes.filter((note) =>
      note.content.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    const deletePromises = notesToDelete.map((note) =>
      API.del("notes", `/notes/${note.noteId}`)
    );

    try {
      await Promise.all(deletePromises);
      setNotes(notes.filter((note) => !notesToDelete.includes(note)));
      setHighlightedNoteId([]);
    } catch (e) {
      onError(e);
    }
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  async function handleSearchClick() {
    try {
      const loadedNotes = await loadNotes();
      setNotes(loadedNotes);

      const matchingNoteIds = loadedNotes.reduce((acc, note) => {
        const words = note.content.toLowerCase().split(/\s+/); // Split by whitespace
        const isMatch = words.some((word) => word.includes(searchTerm.toLowerCase()));
        if (isMatch) {
          acc.push(note.noteId);
        }
        return acc;
      }, []);

      setHighlightedNoteId(matchingNoteIds);
    } catch (e) {
      onError(e);
    }
  }

  function renderNotesList(notes) {
    return (
      <div className="notes-list">
        {notes.map(({ noteId, content, createdAt, attachment }) => {
          const isHighlighted = highlightedNoteId.includes(noteId);
          return (
            <LinkContainer key={noteId} to={`/notes/${noteId}`}>
              <div
                id={`note-${noteId}`}
                className={`note-item${isHighlighted ? " highlighted" : ""}`}
              >
                <div className="note-content">
                  <span className="font-weight-bold">{content.trim().split("\n")[0]}</span>
                  <br />
                  <span className="text-muted">Created: {new Date(createdAt).toLocaleString()}</span>
                </div>
                {attachment && (
                  <div className="note-attachment">
                    <span className="text-muted">Attachment:</span>
                    <img src={attachment} alt="Attachment" />
                  </div>
                )}
              </div>
            </LinkContainer>
          );
        })}
      </div>
    );
  }
  
  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note-taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">
          <i className="material-icons">&#xe8cd;</i> Your Notes
        </h2>
        <div className="search-bar">
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Enter common word"
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: "150px", marginRight: "10px" }}
            />
            <Button
              variant="primary"
              className="search-button"
              onClick={handleSearchClick}
            >
              Search
            </Button>
            <Button
              variant="danger"
              className="delete-button"
              onClick={deleteNotesWithCommonWord}
            >
              Delete
            </Button>
          </InputGroup>
        </div>
        <div className="create-note-button-container">
          <LinkContainer to="/notes/new">
            <Button variant="success" className="create-note-button">
              <BsPencilSquare size={17} /> Create a new note
            </Button>
          </LinkContainer>
        </div>
        <ListGroup ref={listGroupRef}>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  return <div className="Home">{isAuthenticated ? renderNotes() : renderLander()}</div>;
}
