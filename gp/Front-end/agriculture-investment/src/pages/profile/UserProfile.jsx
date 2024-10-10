import React from 'react';
import './UserProfile.css';
import { Link } from "react-router-dom";
import Grid from '@mui/system/Unstable_Grid';

const UserProfile = ({ user }) => {
  return (
    <Grid container xs={12} sm={12} md={12} xl={12} lg={12} className="user-profile-card">
      <Grid container xs={12} sm={12} md={6} xl={6} lg={6}  className="card5">
        <div className="card-body">
          <div className="avatar">
            <img src={user.avatar} alt="User Avatar" />
          </div>
          
          <div className="user-details">
            <h2 >{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>
            <p>Phone: {user.phone}</p>
          </div>
          <div className='updateprofile'>
            <button>
            <Link to={"/updateprofile"}><p>Update</p></Link>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="4">
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            </button>
            </div>
            <div className='history'>
            <button>
            <Link to={"/history"}><p>History</p></Link>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="4">
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            </button>
            </div>
        </div>
        </Grid>
    </Grid>
  );
};

export default UserProfile;