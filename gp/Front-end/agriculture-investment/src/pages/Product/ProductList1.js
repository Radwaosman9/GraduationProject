import React, { useState, useEffect } from "react";
import "./ProductList1.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { useParams } from "react-router-dom";
import { getAuthUser } from "../../helper/Storage"
import Grid from '@mui/system/Unstable_Grid';

const ProductCard = () => {
  let { id } = useParams();
  const auth = getAuthUser();
  const [products, setProducts] = useState({
    loading: true,
    results: [],
    err: null,
  });

  const [fav, setfav] = useState({
    productId: "",
    loading: false,
    err: "",
    success: null

  });

  useEffect(() => {
    setProducts({ ...products, loading: true });
    axios
      .get(`http://localhost:8000/api/v1/products/getallproductcategory/${id}`)
      .then((resp) => {
        console.log(resp);
        setProducts({ ...products, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        
        setProducts({
          ...products,
          loading: false,
          err: "something went wrong",
        });
      });
  }, [id]);

  const sendfav = (productID) => {
    // e.preventDefault();
    if (!auth ) {
      setfav({ ...fav, err: "Please login first to add the product to your favorites." });
      return;
    }
    if (auth && auth.role === "ADMIN") {
      setfav({ ...fav, err: "You are not authorize to access this!" });
      return;
    }
    setfav({ ...fav, loading: true });
    axios
      .post(
        "http://localhost:8000/api/v1/FavList",
        {
          productId: productID,
        },
        {
          headers: {
            Authorization: "Bearer "+auth.token,
          },
        }
      )
      .then((resp) => {
        setfav({ err: null, productId: "" ,loading: false, success:"Product added to your favorites!"});

      })
      .catch((errors) => {
        setfav({ ...fav, loading: false, err: errors.message });
      });
  };

  useEffect(() => {
    if (fav.err ) {
      const timer = setTimeout(() => {
        setfav({
          ...fav,
          err: null,
          // success: null,
        });
        const redirectTimer = setTimeout(() => {
          window.location.href = "/login";
        }, 0);
        return () => clearTimeout(redirectTimer);
      }, 2000); 
  
      return () => clearTimeout(timer); 
    }
    if ( fav.success) {
      const timer = setTimeout(() => {
        setfav({
          ...fav,
          // err: null,
          success: null,
        });
       
      }, 2000); 
  
      return () => clearTimeout(timer); 
    }
   
  }, [fav.err, fav.success]);

  return (
    <Grid container xs={12} sm={12} md={12} xl={12} lg={12} className="container3">
      {products.results.map((product) => (
        <Grid item  xs={12} sm={12} md={2.5} xl={2.5} lg={2.5} className="card-container1" key={product._id}>
          <div className="image-container1">
          <Link to={"/product-info/" + product._id}>
            <img classname="productimg" src={product.image} alt="women" />
            </Link>
          </div>
          <div className="card-title1" >
            <h4>{product.name}</h4>
          </div>
          <div className="card">
          {/* <p>{product.description}</p> */}
          <p>{product.price} EGP</p>
          </div>
          <div>
              <Link className="fav-btn10" onClick={() => sendfav(product._id)}>
                <svg viewBox="0 0 17.503 15.625" height="20.625" width="20.503"  class="fav-icon10">
                    <path transform="translate(0 0)" d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z" id="Fill"></path>
                </svg>
             </Link>
              </div>
          <div className="button">
            <button className="buynow">
              <Link to={"/product-info/" + product._id}>BUY NOW</Link>
            </button>
          </div>
        </Grid>
      ))}
      <div className="alert-container1">
      {products.loading === false && products.err != null && (
        <Alert variant="danger" className="p-2">
          {products.err}
        </Alert>
      )}
 {fav.err && (
    <Alert variant="danger" className="p-2">{fav.err}</Alert>
  )}
  {fav.success && (
    <Alert variant="success" className="p-2">
      {fav.success}
    </Alert>)}

      {products.loading === false && products.err == null && products.results.length === 0 && (
        <Alert variant="info" className="p-2">
          No products, please try again later!
        </Alert>
      )}
      </div>
    </Grid>
  );
};

export default ProductCard;