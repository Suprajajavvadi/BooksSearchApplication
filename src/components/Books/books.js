import "./books.css";
import Header from "../Header/header";
import axios from "axios";
import { useState, useEffect } from "react";
import BookItem from "../BookItem/BookItem"
import "./books.css"

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("Book");
  const [loading,setLoading] = useState(false)

  const getBooks = async () => {
    setLoading(true)
    try {
      if (searchInput.trim() === "") return; // avoid empty API calls
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${searchInput}`
      );
      
      setBooks(response.data.docs);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false)
    }
  };

  // Runs when searchInput changes
  useEffect(() => {
    getBooks();
  }, [searchInput]);

  

  return (
    <div className="home-bg-container">
      <Header />
      {/* <div>
        <input type="search" onChange={handleInput} placeholder="Search books..." />
      </div> */}

      {loading? <div className="loader"></div> : <BookItem data={books} searchInput={searchInput} setSearchInput={setSearchInput} /> }
       
    </div>
  );
};

export default Books;



