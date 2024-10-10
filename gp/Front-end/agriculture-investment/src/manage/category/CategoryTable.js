import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import './ManageCategory.css';
import { Link } from "react-router-dom";
// import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";





const CategoryTable = () => {
    const auth = getAuthUser();
    const [category, setcategory] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });

    useEffect (() => {
        setcategory({ ...category, loading: true });
        axios
          .get("http://localhost:8000/api/v1/categories")
          .then((resp) => {
            // console.log(resp);
        
            setcategory({ ...category, results: resp.data, loading: false, err: null });
          })
          .catch((err) => {
            setcategory({
              ...category,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      },[category.reload]);
      
    
      const deletcategory=(id)=>{
        axios
          .delete(`http://localhost:8000/api/v1/categories/${id}`,{
            headers:{
            Authorization: "Bearer "+ auth.token,
            },
          })
          .then((resp) => {
            setcategory({ ...category, reload: category.reload + 1 });
          })
          .catch((err) => {});
      };
    
    return (

<div>
<Table striped bordered hover className="tablec ">
<thead >
<tr>
{/* <th>#</th> */}
<th>Image</th>
<th>Name</th>
<th>Action</th>
</tr>
</thead>


<tbody>
{category.results.map(category=>(      

<tr key={category._id}>
{/* <td>{category._id}</td> */}
<td>
<img src={category.image} alt={category.name} className="image-category" />
</td>
<td>{category.name}</td>
<td>
<Link to={"/"} className="btn btn-sm btn-success mx-2">Show</Link>
<Link to={"/UpdateCategory/"+ category._id} className="btn btn-sm btn-success mx-2">Update</Link>
<button className="btn btn-sm btn-success" onClick={(e)=>{deletcategory(category._id)}}>Delete</button>
</td>
</tr>))}
</tbody>
</Table>
</div>

);
};

export default CategoryTable;