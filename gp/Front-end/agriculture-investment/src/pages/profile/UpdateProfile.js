import React, { useState,  useEffect } from 'react';
import './UpdateProfile.css';
import { Link } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";



const UpdateProfile = () => {
  
    const auth = getAuthUser();
    const [profiles, setprofiles] = useState({
        name: "",
        email:"",
        address:"",
        phone:"",
      err: "",
      loading: false,
      reload: 0,
      success: null,
    });

   
  

    const profileupdate = (e) => {
      e.preventDefault();
  
     
      setprofiles({ ...profiles, loading: true });

      axios
      .put("http://localhost:8000/api/v1/auth/profile", {"name":profiles.name,"email":profiles.email,
      "address":profiles.address,"phone":profiles.phone }, {
      
        headers: {
          Authorization: "Bearer "+auth.token,
          "Content-Type": "application/json",
        },
       
      })
      .then((resp) => {
        setprofiles({
          ...profiles,
          loading: false,
          success: "Profile updated successfully !",
      //  err:null,
          reload: profiles.reload + 1,
          
        });
     })
     .catch((error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        setprofiles({ ...profiles, loading: false, err: error.response.data.errors });
      }
    });
      

  };
  useEffect(() => {
    if (profiles.err || profiles.success) {
      const timer = setTimeout(() => {
        setprofiles({
          ...profiles,
          err: null,
          success: null,
        });
      }, 2000); 
      return () => clearTimeout(timer); 
    }
  }, [profiles.err, profiles.success]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/auth/profile", {
        headers: {
          Authorization: "Bearer "+auth.token,
        //   "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setprofiles({
          ...profiles,
          name: resp.data.name,
          email:resp.data.email,
          address:resp.data.address,
          phone:resp.data.phone,
       
        });
        })
    
      .catch((err) => {
        setprofiles({
          ...profiles,
          loading: false,
          success: null,
          err: err.message,
        });
      });
  }, []);
  


  return (
    <>

    <div className="user-profile-cardU">
      <div className="card2">
        <div className="card-body2">
          <div className="user-details2">
          <div className="addcategory">
        <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Name</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Enter yor name" 
         value={profiles.name}
            onChange={(e) => setprofiles({ ...profiles, name: e.target.value })}
            required></input>
        </div>
        {/* <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Email</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Enter your email"
         value={profiles.email}
         onChange={(e) => setprofiles({ ...profiles, email: e.target.value })}
         required></input>
          </div> */}
          <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Address</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Enter your address"
         value={profiles.address}
         onChange={(e) => setprofiles({ ...profiles, address: e.target.value })}
         required></input>
          </div>
          <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Phone number</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Enter your phone number"
         value={profiles.phone}
         onChange={(e) => setprofiles({ ...profiles, phone: e.target.value })}
         required></input>
          </div>
        </div>
        <Link to="" className=" create1 btn btn-success mb-3 " onClick={profileupdate}> Save </Link>
      </div>
      </div>
      </div>
      </div>
      <div className="alert-container1">
      {Array.isArray(profiles.err) && profiles.err.length > 0 && profiles.err.map((error, index) => (
        <Alert key={index} variant="danger" className="p-2">
          {error.msg}
        </Alert>
      ))}
 {profiles.success && (
            <Alert variant="success" className="p-2">{profiles.success}</Alert>
 )}
 </div>
      </>
  );
};

export default UpdateProfile;