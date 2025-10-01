import "./home.css"
import Header from "../Header/header"
import { useNavigate } from "react-router-dom"

const Home=()=>{
    const navigate=useNavigate()

    function viewBooksBtn(){
        navigate("/books")
    }

    return(
        <div className="home-bg-container">
            <Header/>
            <div className="home-details-div">
                
                    <h1>Discover Your Next Favorite Book</h1>
                    <p>Step into a world of stories, knowledge, and imagination.
                       Our bookstore brings you timeless classics, modern bestsellers,<br/>
                       and hidden literary gems—curated to inspire every reader.
                    </p>
                    <button className="view-more-books" onClick={viewBooksBtn}>View Books</button>
               
            </div>
        </div>
    )
}
export default Home
