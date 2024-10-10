import './Header.css';
import React, { useState, useRef  } from 'react';
import axios from 'axios';
import {Nav,Navbar } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import { removeAuthUser, getAuthUser } from "../helper/Storage";
import { useNavigate } from "react-router-dom";
import SearchResult from "../pages/search/SearchResult";

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuthUser();
  const [query, setQuery] = useState('');

  const [error, setError] = useState(null);
  // const history = useHistory();
  const Logout = () => {
    removeAuthUser();
    navigate("/");
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/products/search/${query}`);
   
      if (response.data.length === 0) {
        navigate('/SearchResult');
      } else {
        navigate(`/SearchResult?query=${query}`);
      }
    } catch (error) {
      navigate('/SearchResult', { state: { error: 'An error occurred while fetching search results.' } });
    }
  };
    return <header className="main-header">
        <nav>

        <Navbar.Brand>
                        <img src='/images/logo.jpeg' className='logo' alt='logo'/>
                </Navbar.Brand>
                {/* <label class="logo2">AgroFarm</label> */}
                <div>
      <div className="group">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon1">
          <g>
            <path
              d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
            ></path>
          </g>
        </svg>
        <input
          className="input1"
          type="search"
          placeholder="Search.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
      {error && <p>{error}</p>}
      
    </div>
         {/* <div className='search'>
          <input type="text" placeholder="Search.."></input>
         </div> */}
            <ul>
            {!auth && (
              <>
            <li>
                <Link to={"/login"}>Login</Link>
            </li>
            <li>
                <Link to={"/register"}>Register</Link>
            </li>
            </>
            )}
             {/* Admin Routes  */}

             {auth && auth.role === "ADMIN" && (
              <>
            <li>
            <div class="paste-button">
              <button class="buttonmanage">Management&nbsp;▼</button>
              <div class="dropdown-content">
                <a id="top" href="/ManageCategory">Manage Categories</a>
                <a id="middle" href="/ManageProduct">Manage Products</a>
                <a id="bottom" href="/ManageInformation">Manage Information</a>
                <a id="nnnn" href="/showOrders">Orders History</a>
              </div>
            </div>
            </li>
            </>
            )}
            <li>
                <Link to={"/"}>Home</Link>
            </li>
      
            <li>
            {auth &&auth.token  && <Link onClick={Logout}>Logout</Link>}
            </li>
                         {/* Admin Routes  */}

                         {auth && auth.role === "USER" && (
              <>
              <li>
                <Link to={"/chat"}><button class="card4">
      <svg height="40px" width="40px"  viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="discord"><path d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"></path></svg>
    </button></Link>
            </li>
            <li>
            <div>
             <Nav.Link className="fav-btn" href='/fav'>
                <svg viewBox="0 0 17.503 15.625" height="20.625" width="20.503"  className="fav-icon">
                    <path transform="translate(0 0)" d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z" id="Fill"></path>
                </svg>
             </Nav.Link>
             </div> </li>
             <li>
            <div className='iconss'>
             <Nav className="me-auto">
                      <Nav.Link href='/cart'
                            className="nav-text d-flex  justify-content-center"
                            style={{ color: "white" }}>
                            <img src="./images/cart.png"  className="login-img" alt="sfvs" />
                            {/* <p style={{ color: "white" }}>cart</p> */}
                        </Nav.Link>
                        <Nav.Link href='/profile'
                            className="nav-text d-flex justify-content-center">
                            <img src="./images/login.png" className="login-img" alt="sfvs" />
                            {/* <p style={{ color: "white" }}>profile</p> */}
                        </Nav.Link>
                        
                    </Nav>
                    </div> </li>
                    </>
            )}
            </ul>
            
            
        </nav>
     </header>
};
export default Header;