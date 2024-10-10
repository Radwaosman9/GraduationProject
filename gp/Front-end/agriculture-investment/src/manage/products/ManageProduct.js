import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import './ManageProduct.css';
import { Link } from "react-router-dom";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";


const ManageProduct = () => {
  const auth = getAuthUser();
  const [product, setproduct] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect (() => {
      setproduct({ ...product, loading: true });
      axios
        .get("http://localhost:8000/api/v1/products")
        .then((resp) => {
          // console.log(resp);
      
          setproduct({ ...product, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setproduct({
            ...product,
            loading: false,
            err: " something went wrong, please try again later ! ",
          });
        });
    },[product.reload]);
    
  
    const dleteproduct=(id)=>{
      axios
        .delete(`http://localhost:8000/api/v1/products/${id}`,{
          headers:{
          Authorization: "Bearer "+ auth.token,
          },
        })
        .then((resp) => {
          setproduct({ ...product, reload: product.reload + 1 });
        })
        .catch((err) => {});
    };
    return(
        <div className="manage-products p-5 ">
            <div className="header  mb-3">
            <h3 className="text-center ">Manage Products</h3>
            <div className="crp">
            <Link to="/CreateProduct" className="btn btn-success mb-3">Create New Product +</Link>
            </div>
            </div>
        

    <Table striped bordered hover className="tablec">
       <thead >
        <tr>
          {/* <th>#</th> */}
          <th>Image</th>
          <th>Name</th>
          {/* <th>Description</th> */}
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>


      <tbody>
      {product.results.map(product=>(
      
        <tr key={product._id}>
          {/* <td>1</td> */}
          <td>
            <img src={product.image} alt={product.name}
             className="image-products" 
              />
          </td>
          <td>{product.name}</td>
          {/* <td> {product.description}</td> */}
          <td> {product.price}</td>
          <td>
            <Link to={"/product-info/" +product._id} className="btn btn-sm btn-success mx-2">Show</Link>
            <Link to={"/updateP/"+ product._id} className="btn btn-sm btn-success mx-2">Update</Link>
            <button className="btn btn-sm btn-success" onClick={(e)=>{dleteproduct(product._id)}}>Delete</button>
          </td>
        </tr>

))}
      </tbody>
    </Table>
        </div>
    );

};

export default ManageProduct;