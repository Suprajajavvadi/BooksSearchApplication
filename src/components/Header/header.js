import "./header.css"
import {Link} from "react-router-dom"
import logo from "../../../src/site-logo.png"

const Header=()=>{
    return(
        <div className="header-bg-container">
            <div className="navbar">
                <img src={logo} className="site-logo"/>
                <div className="links-div">
                     <Link className="link-item" to="/">Home</Link>
                     <Link className="link-item" to="/books">Books</Link>
                </div>
               
            </div>

        </div>
    )
}
export default Header