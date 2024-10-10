import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import '../category/ManageCategory.css';
// import './infoTable.css';
import { Link } from "react-router-dom";
// import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";





const InfoTable = () => {
    const auth = getAuthUser();
    const [info, setinfo] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });

    useEffect (() => {
        setinfo({ ...info, loading: true });
        axios
          .get("http://localhost:8000/api/v1/Informations")
          .then((resp) => {
            // console.log(resp);
        
            setinfo({ ...info, results: resp.data, loading: false, err: null });
          })
          .catch((err) => {
            setinfo({
              ...info,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      },[info.reload]);
      
    
      const delteinfo=(id)=>{
        axios
          .delete(`http://localhost:8000/api/v1/Informations/${id}`,{
            headers:{
            Authorization: "Bearer "+ auth.token,
            },
          })
          .then((resp) => {
            setinfo({ ...info, reload: info.reload + 1 });
          })
          .catch((err) => {});
      };
    
    return (

<div>
<Table striped bordered hover className="tablec">
<thead >
<tr>
{/* <th>#</th> */}
<th>Image</th>
<th>Name</th>
<th>Info</th>
<th>Action</th>
</tr>
</thead>


<tbody>
{info.results.map(info=>(      

<tr key={info._id}>
{/* <td>{category._id}</td> */}
<td>
<img src={info.image} alt={info.information} className="image-category" />
</td>
<td>{info.name}</td>
<td >{info.information} </td>
<td>

<Link to={"/UpdateInformation/"+ info._id} className="btn btn-sm btn-success mx-2">Update</Link>
<button className="btn btn-sm btn-success" onClick={(e)=>{delteinfo(info._id)}}>Delete</button>
</td>
</tr>))}
</tbody>
</Table>
</div>

);
};

export default InfoTable;