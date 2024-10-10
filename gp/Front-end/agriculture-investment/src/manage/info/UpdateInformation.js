import React, { useState, useRef, useEffect }  from "react";
import '../category/UpdateCategory.css';
import { Link } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateInformation = () => {
    let { id } = useParams();
  const auth = getAuthUser();
  const [info, setinfo] = useState({
    information: "",
    name: "",
    image: null,
    err: "",
    loading: false,
    reload: false,
    success: null,
  });
  const image = useRef(null);
  const UpdateInfo = (e) => {
    e.preventDefault();

    setinfo({ ...info, loading: true });

    const formData = new FormData();
    formData.append("information", info.information);
    formData.append("name", info.name);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:8000/api/v1/Informations/"+id , formData, {
      headers: {
        Authorization: "Bearer "+auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setinfo({
        ...info,
        loading: false,
        success: "Information updated successfully !",
        image: resp.data.data.image,
        reload: info.reload + 1,
      });
    })
    .catch((error) => {
      const errorMessage = error.response.data.errors && Array.isArray(error.response.data.errors)
      ? error.response.data.errors.map(error => error.msg)
      : 'Insert an image please.';
      setinfo({
        ...info,
        loading: false,
        success: null,
        err: errorMessage,
      });
    });
};
useEffect(() => {
  axios
    .get("http://localhost:8000/api/v1/Informations/"+id)
    .then((resp) => {
      setinfo({
        ...info,
        information: resp.data.data.information,
        name: resp.data.data.name,
        image: resp.data.data.image,
      });
      console.log(resp.data); })
  
    .catch((err) => {
      setinfo({
        ...info,
        loading: false,
        success: null,
        err: err.message,
      });
    });
}, [info.reload]);

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

    return( 
    <div className="manage-products1 p-5">
      <div className="alert-container1">
          {info.err && (
           <Alert variant="danger" className="p-2">{info.err}</Alert>
           )}
            {info.success && (
        <Alert variant="success" className="p-2" >
          {info.success}
        </Alert>
      )}
      </div>
            <div className=" mb-0 mt-0">

            <h3 className="text-center mt-0">Update Information</h3>
            <img 
          alt={info.information}
          style={{
            width: "30%",
            height: "200px",
            objectFit: "fill",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "2px",
            
            
          }}
          src={info.image}
        />


            </div>
            <div className="updatecategory">
            <div class="mb-1" className="categoryname1">
            <label for="exampleFormControlInput1" class=" form-label">Name</label>
            <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Name"
             value={info.name}onChange={(e) => setinfo({ ...info, name: e.target.value })}></input>
            </div>
            <div class="mb-1 " className="categoryname1">
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
            <div class="mb-2" className="categoryname2">
            <label for="exampleFormControlInput1" class="form-label">Image</label>
            <input type="file" class="form-control" id="exampleFormControlInput1" placeholder="Image" 
            alt={info.information} ref={image}
            ></input>
            </div>
            <Link to="" className=" createe btn btn-success mb-8"onClick={UpdateInfo}> Save changes </Link>
            {/* <Link to="" className=" createe btn btn-primary mb-8 m-3"> See changes </Link> */}
            </div>
            </div>



    );

};

export default UpdateInformation;