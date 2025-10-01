BookSearchApplication

A simple, responsive React app to search and browse books using external APIs.

Project Overview

BookSearchApplication is a React-based web app that lets users search for books, view details, filter results, and save favorites. The project is organized for easy development and extensibility.


Features

Search books by title, author, or ISBN

View book details (title, authors, publisher, published date, description)

Filters for year and availability (public/private)

Responsive UI for desktop and mobile

Modal view for selected book with additional details

Links to OpenLibrary and Internet Archive versions

Safe display of HTML-encoded titles using he library


Tech Stack

Frontend: React (Create React App)

Styling: CSS

HTTP Requests: axios

State Management: React hooks (useState, useEffect)

Routing: react-router-dom v6

Icons: react-icons

Folder Structure


book-search-application/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ BookFilters/
│  │  ├─ BookItem/
│  │  ├─ Books/
│  │  ├─ Header/
│  │  └─ Home/
│  ├─ App.js
│  └─ index.js
├─ package.json
├─ .gitignore
└─ README.md



Component Overview
1. App.js (Routing Setup)

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/home';
import Books from './components/Books/books';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/books" element={<Books/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


Uses BrowserRouter for client-side navigation

Routes:

/ → Home

/books → Books


2. Header.js (Navigation)


import "./header.css";
import { Link } from "react-router-dom";
import logo from "../../../src/site-logo.png";

const Header = () => (
  <div className="header-bg-container">
    <div className="navbar">
      <img src={logo} className="site-logo" />
      <div className="links-div">
        <Link className="link-item" to="/">Home</Link>
        <Link className="link-item" to="/books">Books</Link>
      </div>
    </div>
  </div>
);

export default Header;


Displays logo and navigation links

Uses Link for smooth client-side navigation

3. Home.js (Landing Page)

import "./home.css";
import Header from "../Header/header";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-bg-container">
      <Header/>
      <div className="home-details-div">
        <h1>Discover Your Next Favorite Book</h1>
        <p>
          Step into a world of stories, knowledge, and imagination...
        </p>
        <button className="view-more-books" onClick={() => navigate("/books")}>View Books</button>
      </div>
    </div>
  );
};

export default Home;


Landing page with headline, description, and button to navigate to Books page

4. Books.js (Book Search Page)

import "./books.css";
import Header from "../Header/header";
import axios from "axios";
import { useState, useEffect } from "react";
import BookItem from "../BookItem/BookItem";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("Book");
  const [loading, setLoading] = useState(false);

  const getBooks = async () => {
    setLoading(true);
    if (!searchInput.trim()) return;
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?title=${searchInput}`);
      setBooks(response.data.docs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getBooks(); }, [searchInput]);

  return (
    <div className="home-bg-container">
      <Header />
      {loading ? <div className="loader"></div> : <BookItem data={books} searchInput={searchInput} setSearchInput={setSearchInput} />}
    </div>
  );
};

export default Books;

Fetches books from OpenLibrary API

Displays a loader while fetching

Passes books data to BookItem component

5. BookItem.js / BookList Component

Displays individual books in cards

Search bar for new titles

Filters results via BookFilters

Modal with extended details

Shows cover image, authors, year, editions, languages, availability

Links to OpenLibrary and Internet Archive

import React, { useState } from "react";
import "./BookItem.css"
import BookFilters from "../BookFilters/BookFilters";
import he from "he";
import { FaSearch } from "react-icons/fa";



function BookList({ data, searchInput, setSearchInput }) {
    const books = data;
    const [selectedBook, setSelectedBook] = useState(null); // store book details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({ year: "", availability: "" });
    const [bookName, setBookname] = useState("Book");



    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };


    const openModal = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedBook(null);
        setIsModalOpen(false);
    };

    const filteredBooks = books.filter((book) => {
        let matchesYear = true;
        let matchesAvailability = true;

        if (filters.year) {
            matchesYear = book.first_publish_year <= Number(filters.year);
        }

        if (filters.availability) {
            if (filters.availability === "public") {
                matchesAvailability = book.ebook_access === "public";
            } else {
                matchesAvailability = book.ebook_access !== "public";
            }
        }

        return matchesYear && matchesAvailability;
    });

    function handleInput(e) {
        setBookname(e.target.value);
    }

    function handleSearch() {
        setSearchInput(bookName);
    }

    return (
        <div className="books-main-container">
            <div className="filter-container">
                <div className="search-div">
                    <input
                        type="search"
                        value={bookName}
                        onChange={handleInput}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch(); // Call your function here
                            }
                        }}
                        placeholder="Search books..."
                    />
                    <FaSearch className="search-icon" />
                </div>


                <BookFilters onFilterChange={setFilters} />
            </div>

            <div className="book-container">

                {filteredBooks.length > 0 ? filteredBooks.map((book, index) => (
                    <div
                        key={book.key || index}
                        className="book-card"
                    >
                        {/* Book Cover */}
                        <div className="image-div">
                            {book.cover_i ? (
                                <img
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                    alt="book-cover"
                                    className="book-image-cover"
                                />
                            ) : (
                                <div className="no-book-image-cover">
                                    <span>No Cover Image</span>
                                </div>
                            )}
                        </div>


                        {/* Book Info */}
                        <h4 className="">
                            {truncateText(he.decode(book.title), 30)}
                        </h4>

                        <p className=""> <span className="datails-head">Authors: </span> {book.author_name?.join(", ") || "Unknown"}</p>

                        <div className="year-edition-div">
                            <p className=""><span className="datails-head">First Published: </span> {book.first_publish_year || "N/A"}</p>
                            <p className=""><span className="datails-head">Editions: </span>{book.edition_count}</p>
                        </div>

                        <p className=""><span className="datails-head">Languages: </span>{book.language?.join(", ")}</p>

                        {/* Ebook Access */}
                        <div className="year-edition-div">
                            <p className="">
                                <span className="datails-head">Availablity : </span>
                                {book.ebook_access === "public"
                                    ? "eBook available"
                                    : "Restricted Access"}
                            </p>

                            <button className="view-more-btn" onClick={() => openModal(book)} >More Details</button>
                        </div>

                    </div>
                )) : <div className="no-books-div"><h1>No Books</h1></div>}

                {isModalOpen && selectedBook && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                        >


                            <div className="model-image-div">
                                {selectedBook.cover_i ? (
                                    <>
                                        <img
                                            src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-M.jpg`}
                                            alt="book-cover"
                                            className="book-image-cover"
                                        />
                                        <h4>{he.decode(selectedBook.title)}</h4>
                                    </>
                                ) : (
                                    <>

                                        <div className="no-book-image-cover">
                                            <span>No Cover Image</span>
                                        </div>
                                        <h4>{he.decode(selectedBook.title)}</h4>
                                    </>
                                )}
                            </div>
                            <div className="model-content-div">
                                <button className="close-btn" onClick={closeModal}>
                                    ✖
                                </button>


                                <div className="details-para-div">
                                    <p className="model-para">
                                        <strong>Authors:</strong>{" "}
                                        {selectedBook.author_name?.join(", ") || "Unknown"}
                                    </p>
                                    <p className="model-para">
                                        <strong>First Published:</strong>{" "}
                                        {selectedBook.first_publish_year || "N/A"}
                                    </p>
                                </div>
                                <div className="details-para-div">
                                    <p className="model-para">
                                        <strong>Editions:</strong> {selectedBook.edition_count}
                                    </p>
                                    <p className="model-para">
                                        <strong>Languages:</strong>{" "}
                                        {selectedBook.language?.join(", ") || "N/A"}
                                    </p>
                                </div>
                                <p className="model-para">
                                    <strong>Availability:</strong>{" "}
                                    {selectedBook.ebook_access === "public"
                                        ? "eBook available"
                                        : "Restricted Access"}
                                </p>
                                {/* IA Links */}
                                {selectedBook.ia?.length > 0 && <h3>Read Online:</h3>}
                                {selectedBook.ia?.length > 0 && (
                                    <div className="versions-div">

                                        {selectedBook.ia.map((id, i) => (
                                            <a
                                                href={`https://archive.org/details/${id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="version-links"
                                            >
                                                Version {i + 1}
                                            </a>
                                        ))}

                                    </div>
                                )}
                                {/* IA Collections */}
                                {selectedBook.ia_collection_s && <h3>Available in:</h3>}
                                {selectedBook.ia_collection_s && (
                                    <div className="collection-availabele-div">
                                        {selectedBook.ia_collection_s
                                            .split(";")
                                            .map((col, i) => (
                                                <span className="collection-name" key={i}>{col.replace(/_/g, " ")},</span>
                                            ))}

                                    </div>
                                )}
                                {/* OpenLibrary Link */}
                                {selectedBook.key && (
                                    <p>
                                        <a
                                            href={`https://openlibrary.org${selectedBook.key}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on OpenLibrary
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default BookList;


6. BookFilters.js

Filters by published year (range) and availability

Calls parent callback onFilterChange to update filtered books

import { useState } from "react";
import "./BookFilters.css";

export default function BookFilters({ onFilterChange }) {
  const [year, setYear] = useState("");
  const [availability, setAvailability] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ year, availability });
  };

  return (
    <div className="book-filters">
      {/* First Published Year Range */}
      <div className="filter-section">
        <label className="filter-label">Published Year</label>
        <input
          type="range"
          min="1800"
          max="2025"
          step="1"
          className="year-range"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <span className="year-text">Year: {year}</span>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <label className="filter-label">Availability</label>
        <select
          className="availability-select"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="">All</option>
          <option value="public">Public</option>
          <option value="private">Not Public</option>
        </select>
      </div>

      {/* Apply */}
      <div className="filter-apply">
        <button onClick={handleFilterChange} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  );
}



Setup & Installation

git clone <repo-url>
cd book-search-application
npm install
npm start

Start dev server: npm start

Build for production: npm run build



Notes:

BookFilters allows users to filter book results by Published Year (range slider) and Availability (public/private).

Calls onFilterChange callback to update filters in the parent component (BookList).

Uses React useState for controlled inputs.

Styled via BookFilters.css.

Includes an Apply button to trigger the filter updates.

Ensure axios and react-icons are installed

CSS files handle responsive layout and modal styling

HTML-encoded book titles handled via he library
