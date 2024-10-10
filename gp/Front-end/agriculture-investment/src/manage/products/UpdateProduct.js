import React , { useState, useRef, useEffect } from "react";
import './UpdateProduct.css';
import { Link } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [product, setproduct] = useState({
      name: "",
      description:"",
      price:"",
      category:"",
      image: null,
      err: "",
      loading: false,
      reload: false,
      success: null,
    });

    const [categories, setCategories] = useState([]);
    const image = useRef(null);

    useEffect(() => {
        // Fetch categories when the component mounts
        fetchCategories();
      },[]);
    
      const fetchCategories = () => {
        axios.get("http://localhost:8000/api/v1/categories", {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        })
        .then((response) => {
          setCategories(response.data); // Assuming response.data is an array of categories
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
      };


    const updateproduct = (e) => {
      e.preventDefault();
  
      setproduct({ ...product, loading: true });
  
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
      }
      axios
      .put("http://localhost:8000/api/v1/products/"+id , formData, {
        headers: {
          Authorization: "Bearer "+auth.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setproduct({
          ...product,
          loading: false,
          success: "Product updated successfully !",
          image: resp.data.data.image,
          reload: product.reload + 1,
        });
      })
      .catch((error) => {
        const errorMessage = error.response.data.errors && Array.isArray(error.response.data.errors)
        ? error.response.data.errors.map(error => error.msg)
        : 'Insert an image please.';
        setproduct({
          ...product,
          loading: false,
          success: null,
          err: errorMessage,
        });
      });
  };
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/products/"+id)
      .then((resp) => {
        setproduct({
          ...product,
          name: resp.data.name,
          description:resp.data.description,
          price:resp.data.price,
          category:resp.data.category,
          image: resp.data.image,
        });
        console.log(resp.data); })
    
      .catch((err) => {
        setproduct({
          ...product,
          loading: false,
          success: null,
          err: err.message,
        });
      });
  }, [product.reload]);
  

  useEffect(() => {
    if (product.err || product.success) {
      const timer = setTimeout(() => {
        setproduct({
          ...product,
          err: null,
          success: null,
        });
      }, 2000); 
  
      return () => clearTimeout(timer); 
    }
  }, [product.err, product.success]);
    return( <>
    <div className="alert-container1">
{product.err && (
  <div>
    {product.err.map((errorMessage, index) => (
      <Alert key={index} variant="danger" className="p-2">{errorMessage}</Alert>
    ))}
  </div>
)}
{product.success && (
           <Alert variant="success" className="p-2">{product.success}</Alert>
)}
</div>
        <div className="manage-product p-5">
        <div className="header mb-3">
        <h3 className="text-center ">Update Product</h3>
        <img 
          alt={product.name}
          style={{
            width: "20%",
            height: "200px",
            objectFit: "fill",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            
            
          }}
          src={product.image}
        />
        </div>
        <div className="addcategory">
        <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Product Name</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="name"
         value={product.name}
            onChange={(e) => setproduct({ ...product, name: e.target.value })}
            required></input>
        </div>
        <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Description</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Description" 
        value={product.description}
            onChange={(e) => setproduct({ ...product, description: e.target.value })}
            required></input>
        </div>
        <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Price</label>
        <input type="text" class=" form-control" id="exampleFormControlInput1" placeholder="Price"
        value={product.price}
            onChange={(e) => setproduct({ ...product, price: parseFloat( e.target.value )})}
            required></input>
        </div>
        <div class="mb-5 " className="productname">
        <label for="exampleFormControlInput1" class=" form-label">Select a Category</label>
        <select class="form-select" aria-label="Default select example" value={product.category}
        onChange={(e) => setproduct({ ...product, category: e.target.value })}  >
        <option value="">select</option>
            {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name} </option>
               
              ))}
        </select>
        </div>
        <div class="mb-5" className="productname">
        <label for="exampleFormControlInput1" class="form-label">Image</label>
        <input type="file" class="form-control" id="exampleFormControlInput1" ref={image} ></input>
        </div>

        <Link to="" className=" create btn btn-success mb-3 " onClick={updateproduct}> Save </Link>
        </div>
        </div>
        </>


    );

};

export default UpdateProduct;