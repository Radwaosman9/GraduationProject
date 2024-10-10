import React, { useEffect, useState } from 'react';
import UserProfile from './UserProfile';
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";

const Profile = () => {
    const auth = getAuthUser();
    const [profile, setprofile] = useState({
      loading: true,
      results: null,
      err: null,
      reload: 0,
    });

    useEffect (() => {
        setprofile({ ...profile, loading: true });
        axios
          .get("http://localhost:8000/api/v1/auth/profile",{
                    headers:{
                    Authorization: "Bearer "+ auth.token,
                    },
                  })
          .then((resp) => {
            // console.log(resp);
        
            setprofile({ ...profile, results: resp.data, loading: false, err: null });
          
          })
          .catch((err) => {
            setprofile({
              ...profile,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      },[profile.reload]);
     

  return (
    <div>
      <h1 style={{ color: 'rgb(3, 93, 28)', fontSize: '40px',fontWeight: 'bold', margin: '30px' ,textAlign:'center'}}>User Profile</h1>
      {profile.results && (
        <UserProfile
            key={profile.results._id}  // Make sure to use a unique key for each user
            user={{
              name: profile.results.name,
              email: profile.results.email,
              avatar: profile.results.avtar,
            //   bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              address: profile.results.address,
              phone: profile.results.phone,
            }}
          />
          )}
    </div>
  );
};

export default Profile;