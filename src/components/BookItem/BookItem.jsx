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




