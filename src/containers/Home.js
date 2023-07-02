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
  const [highlightedNoteId, setHighlightedNoteId] = useState(null);
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
    if (highlightedNoteId && listGroupRef.current) {
      const highlightedNote = listGroupRef.current.querySelector(
        `#note-${highlightedNoteId}`
      );
      if (highlightedNote) {
        highlightedNote.scrollIntoView({ behavior: "smooth" });
      }
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
      setHighlightedNoteId(null);
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
      if (loadedNotes.length > 0) {
        const matchingNote = loadedNotes.find(
          (note) => note.content.toLowerCase() === searchTerm.toLowerCase()
        );
        if (matchingNote) {
          setHighlightedNoteId(matchingNote.noteId);
        } else {
          setHighlightedNoteId(null);
        }
      } else {
        setHighlightedNoteId(null);
      }
    } catch (e) {
      onError(e);
    }
  }

  function renderNotesList(notes) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item
            action
            className="py-3 text-nowrap text-truncate"
          >
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">
              Create a new note
            </span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item
              action
              id={`note-${noteId}`}
              className={highlightedNoteId === noteId ? "highlighted" : ""}
            >
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
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
            />
            <InputGroup.Append>
              <Button
                variant="primary"
                onClick={handleSearchClick}
              >
                Search
              </Button>
              <Button
                variant="danger"
                onClick={deleteNotesWithCommonWord}
              >
                Delete
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        <ListGroup ref={listGroupRef}>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
