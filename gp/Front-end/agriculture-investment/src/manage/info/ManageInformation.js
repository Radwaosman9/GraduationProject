import React, { useRef, useState,useEffect } from "react";
// import Table from 'react-bootstrap/Table';
import '../category/ManageCategory.css';
// import { Link } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import InfoTable from './InfoTable';





const ManageInformation = () => {
  const auth = getAuthUser();
  const [info, setinfo] = useState({
    information: "",
    name: "",
    err: "",
    loading: false,
    success: null,

  });

  const image = useRef(null);
  const createinfo = (e) => {
    e.preventDefault();

    setinfo({ ...info, loading: true });
    const formData = new FormData();
  formData.append("information", info.information);
  formData.append("name", info.name);
  if (image.current.files && image.current.files[0]) {
    formData.append("image", image.current.files[0]);
  }
  // console.log(formData);



  axios
    .post("http://localhost:8000/api/v1/Informations", formData, {
      headers: {
        Authorization: "Bearer "+auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setinfo({
        information: "",
        name: "",
        err: null,
        loading: false,
        success: "Information Created Successfully !",
  
      });
      image.current.value = null;
      window.location.reload();
    })
    
    .catch((error) => {
      const errorMessage = error.response.data.errors && Array.isArray(error.response.data.errors)
      ? error.response.data.errors.map(error => error.msg)
      : 'Insert an image please.';
      setinfo({
        ...info,
        loading: false,
        success: null,
        err: errorMessage ,
      });
    });
};
useEffect(() => {
  if (info.err || info.success) {
    const timer = setTimeout(() => {
      setinfo({
        ...info,
        err: null,
        success: null,
      });
    }, 2000); 

    return () => clearTimeout(timer); 
  }
}, [info.err, info.success]);
    return( <>
    <div className="alert-container1">
    {info.err && (
  <div>
    {info.err.map((errorMessage, index) => (
      <Alert key={index} variant="danger" className="p-2">{errorMessage}</Alert>
    ))}
  </div>
)}
{info.success && (
           <Alert variant="success" className="p-2">{info.success}</Alert>
)}
</div>
        <div className="manage-category p-3">
            <div className="header mb-3">
            <h3 className="text-center ">Create Information</h3>
            </div> 
            <div className="addcategory">
            <div class="mb-5 " className="categoryname">
            <label for="exampleFormControlInput1" class=" form-label">name</label>
            <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="name" 
            value={info.name}
            onChange={(e) => setinfo({ ...info, name: e.target.value })}
            required></input>
            </div>
            <div class="mb-5 " className="categoryname">
            <label for="exampleFormControlInput1" class=" form-label">Information</label>
                    <textarea
        className=" form-control"
        id="exampleFormControlInput1" placeholder="information"
         value={info.information}
            onChange={(e) => setinfo({ ...info, information: e.target.value })}
            required
         rows={5}
         ></textarea>
            </div>
            <div class="mb-5" className="categoryname">
            <label for="exampleFormControlInput1" class="form-label">Image</label>
            <input type="file" class="form-control" id="exampleFormControlInput1" ref={image} required></input>
            </div>
            <button className=" create btn btn-success mb-3 " onClick={createinfo}> Create </button>
            </div>
            
            <InfoTable />
        </div>
        </>
    );

};

export default ManageInformation;