import React, { useRef, useState,useEffect } from "react";
// import Table from 'react-bootstrap/Table';
import './ManageCategory.css';
// import { Link } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import CategoryTable from './CategoryTable';





const ManageCategory = () => {
  const auth = getAuthUser();
  const [category, setcategory] = useState({
    name: "",
    err: "",
    loading: false,
    success: null,

  });

  const image = useRef(null);
  const createcategory = (e) => {
    e.preventDefault();

    setcategory({ ...category, loading: true });
    const formData = new FormData();
  formData.append("name", category.name);
  if (image.current.files && image.current.files[0]) {
    formData.append("image", image.current.files[0]);
  }
  // console.log(formData);



  axios
    .post("http://localhost:8000/api/v1/categories", formData, {
      headers: {
        Authorization: "Bearer "+auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setcategory({
        name: "",
        err: null,
        loading: false,
        success: "category Created Successfully !",
  
      });
      image.current.value = null;
      window.location.reload();
    })
    
    .catch((error) => {
      // console.log('Error:', error); // Log the entire error object
      // console.log('Error response data:', error.response.data); 
      const errorMessage = error.response.data.errors && Array.isArray(error.response.data.errors)
      ? error.response.data.errors.map(error => error.msg).join(', ')
      : 'Insert an image please.';
      setcategory({
        ...category,
        loading: false,
        success: null,
        err: errorMessage ,
      });
    });
};
useEffect(() => {
  if (category.err || category.success) {
    const timer = setTimeout(() => {
      setcategory({
        ...category,
        err: null,
        success: null,
      });
    }, 2000); 

    return () => clearTimeout(timer); 
  }
}, [category.err, category.success]);
    return( <>
<div className="alert-container1">
  {category.err && (
    <Alert variant="danger" className="p-2">{category.err}</Alert>
  )}
  {category.success && (
    <Alert variant="success" className="p-2">
      {category.success}
    </Alert>
  )}
</div>
        <div className="manage-category p-5">
            <div className="header mb-3">
            <h3 className="text-center ">Create Category</h3>
            </div>
            <div className="addcategory">
            <div class="mb-5 " className="categoryname">
            <label for="exampleFormControlInput1" className=" form-label">Category Name</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="name" 
            value={category.name}
            onChange={(e) => setcategory({ ...category, name: e.target.value })}
            required></input>
            </div>
            <div class="mb-5" className="categoryname">
            <label for="exampleFormControlInput1" class="form-label">Image</label>
            <input type="file" class="form-control" id="exampleFormControlInput1" ref={image} required></input>
            </div>
            <button className=" create btn btn-success mb-3 " onClick={createcategory}> Create </button>
            </div>
            
            <CategoryTable />
        </div>
        </>
    );

};

export default ManageCategory;