import React, { useState, useRef, useEffect }  from "react";
import './UpdateCategory.css';
import { Link } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateCategory = () => {
    let { id } = useParams();
  const auth = getAuthUser();
  const [category, setcategory] = useState({
    name: "",
    image: null,
    err: "",
    loading: false,
    reload: false,
    success: null,
  });
  const image = useRef(null);
  const UpdateCategory = (e) => {
    e.preventDefault();

    setcategory({ ...category, loading: true });

    const formData = new FormData();
    formData.append("name", category.name);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:8000/api/v1/categories/"+id , formData, {
      headers: {
        Authorization: "Bearer "+auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setcategory({
        ...category,
        loading: false,
        success: "category updated successfully !",
        image: resp.data.data.image,
        reload: category.reload + 1,

      });
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        setcategory({ ...category, loading: false, err: error.response.data.errors });
      } 
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

useEffect(() => {
  axios
    .get("http://localhost:8000/api/v1/categories/"+id)
    .then((resp) => {
      setcategory({
        ...category,
        name: resp.data.data.name,
        image: resp.data.data.image,
      });
      console.log(resp.data); })
  
    .catch((err) => {
      
      setcategory({
        ...category,
        loading: false,
        success: null,
        err: err.message,
      });
    });
}, [category.reload]);




    return( 
    <div className="manage-products1 p-5">
<div className="alert-container1">
            {category.success && (
    <Alert variant="success" className="p-2">
      {category.success}
    </Alert>
  )}
            {Array.isArray(category.err) && category.err.map((error, index) => (
  <Alert key={index} variant="danger" className="p-2">
    {error.msg}
  </Alert>
))}

</div>
            <div className=" mb-5">

            <h3 className="text-center ">Update Category</h3>
            <img 
          alt={category.name}
          style={{
            width: "30%",
            height: "200px",
            objectFit: "fill",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            
            
          }}
          src={category.image}
        />


            </div>
            <div className="updatecategory">
            <div class="mb-5 " className="categoryname1">
            <label for="exampleFormControlInput1" class=" form-label">Category Name</label>
            <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="name"
             value={category.name}onChange={(e) => setcategory({ ...category, name: e.target.value })}></input>
            </div>
            <div class="mb-5" className="categoryname2">
            <label for="exampleFormControlInput1" class="form-label">Image</label>
            <input type="file" class="form-control" id="exampleFormControlInput1" placeholder="Image" 
            alt={category.name} ref={image}
            ></input>
            </div>
            <Link to="" className=" createe btn btn-success mb-3 m-3"onClick={UpdateCategory}> Save changes </Link>
            {/* <Link to="" className=" createe btn btn-primary mb-3 m-3"> See changes </Link> */}
            </div>
            </div>



    );

};

export default UpdateCategory;