import React, { useState, useEffect } from "react";
import "./ProductInfo.css";
import ProductReview from "../../components/ProductReview"
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage"
import Form from "react-bootstrap/Form";

const ProductInfo = () => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [product, setProduct] = useState({
      loading: true,
      result: null,
      reload: 0,
      err: null
    });
  
    const [review, setReview] = useState({
      Reviewtext: "",
      loading: false,
      err: "",
      success: null
    });
    const [fav, setfav] = useState({
      productId: "",
      loading: false,
      err: "",
      success: null

    });

    const [cart, setcart] = useState({
      products: [],
      loading: false,
      err: "",
      success: null

    });
    
  
    useEffect(() => {
      axios
        .get("http://localhost:8000/api/v1/products/" + id)
        .then((resp) => {
          console.log(resp);
          setProduct({ result: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setProduct({ loading: false, err: err.message });
        });
    }, [product.reload]);
  
    const sendReview = (e) => {
      e.preventDefault();
      setReview({ ...review, loading: true });
      axios
        .post(
          "http://localhost:8000/api/v1/products/review",
          {
            product: id,
            Reviewtext: review.Reviewtext,
          },
          {
            headers: {
              Authorization: "Bearer "+auth.token,
            },
          }
        )
        .then((resp) => {
          setReview({ err: null, Reviewtext: "", loading: false,success:"Review added successfuly!" });
          setProduct({ ...product, reload: product.reload + 1 });
        })
        .catch((errors) => {
          setReview({ ...review, loading: false, err:"Write yor Review first!" });
        });
    };
    const sendfav = (e) => {
      e.preventDefault();
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
            productId: id,
          },
          {
            headers: {
              Authorization: "Bearer "+auth.token,
            },
          }
        )
        .then((resp) => {
          setfav({ err: null, productId: "", loading: false, success:"Product added to your favorites!"});

        })
        .catch((errors) => {
          setfav({ ...fav, loading: false, err: errors.message });
        });
    };
    const addcart = (e) => {
      e.preventDefault();
      if (!auth ) {
        setcart({ ...cart, err: "Please login first to add the product to your cart." });
        return;
      }
      if (auth && auth.role === "ADMIN") {
        setcart({ ...cart, err: "You are not authorize to access this!" });
        return;
      }
      setcart({ ...cart, loading: true });
      axios
        .post(
          "http://localhost:8000/api/v1/cart",
          {
            products: [{ productId: id, quantity: 1 }],
          },
          {
            headers: {
              Authorization: "Bearer "+auth.token,
            },
          }
        )
        .then((resp) => {
          setcart({ err: null, products: [], loading: false, success:"Product added to your cart!"});

        })
        .catch((errors) => {
          setcart({ ...cart, loading: false, err: errors.message });
        });
    };

    useEffect(() => {
      if (review.err || review.success) {
        const timer = setTimeout(() => {
          setReview({
            ...review,
            err: null,
            success: null,
          });
        }, 2000); 
    
        return () => clearTimeout(timer); 
      }
    }, [review.err, review.success]);

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

    useEffect(() =>{
      if (cart.err ) {
        const timer = setTimeout(() => {
          setcart({
            ...cart,
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
      if ( cart.success) {
        const timer = setTimeout(() => {
          setcart({
            ...cart,
            // err: null,
            success: null,
          });
         
        }, 2000); 
    
        return () => clearTimeout(timer); 
      }
    }, [cart.err, cart.success]);
    return (
      
      <div className="movie-details-container p-4">
        {/* Product Details */}
        {product.loading === false && product.err == null && (
          <>
            <div className="row">
              <div className="col-3">
                <img
                  className="movie-image"
                  src={product.result.image}
                  alt={product.result.name}
                />
              </div>
              <div className="col-2">
                <h3 > {product.result.name} </h3>
                <p>{"Description: "+ product.result.description}</p>
                <p>{"Price: "+ product.result.price +" EGP"}</p>
              {/* </div>
              <div> */}
              <Link className="fav-btn1" onClick={sendfav} >
                <svg viewBox="0 0 17.503 15.625" height="20.625" width="20.503"  class="fav-icon1">
                    <path transform="translate(0 0)" d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z" id="Fill"></path>
                </svg>
             </Link>
              {/* </div>
              <div className="button1"> */}
            <button className="buynow1" onClick={addcart}>
             Add to cart
            </button>
          </div>
            </div>
  
            {/* Reviews */}
            <h1 className="re">Product Reviews</h1>
            {auth && auth.role === "USER" &&(
              <Form onSubmit={sendReview}>
                <Form.Group className="mb-7">
                  <textarea className="te"
                    value={review.Reviewtext}
                    onChange={(e) =>
                      setReview({ ...review, Reviewtext: e.target.value })
                    }
                    placeholder="Write your review"
                    rows={2}
                  ></textarea>
                </Form.Group>
  
                <Form.Group className="mb-9">
                  <button className="o1 " onClick={sendReview}>Send Review</button>
                </Form.Group>
              </Form>
            )}
  
           
  {product.result.Review.map((Review, index) => (
  <ProductReview
    key={index}
    reviewId={Review._id} // Pass the review ID
    review={Review.Reviewtext}
    userId={Review.User._id}
    User={Review.User.name}
    onDelete={(deletedReviewId) => {
      // Handle review deletion (e.g., update state to remove the deleted review)
      setProduct({
        ...product,
        result: {
          ...product.result,
          Review: product.result.Review.filter(r => r._id !== deletedReviewId)
        }
      });
    }}
  />
))}
  
  <div className="alert-container1">
  {review.err && (
    <Alert variant="danger" className="p-2">{review.err}</Alert>
  )}
  {review.success && (
    <Alert variant="success" className="p-2">
      {review.success}
    </Alert>
  )}
   {fav.err && (
    <Alert variant="danger" className="p-2">{fav.err}</Alert>
  )}
  {fav.success && (
    <Alert variant="success" className="p-2">
      {fav.success}
    </Alert>)}

    {cart.err && (
    <Alert variant="danger" className="p-2">{cart.err}</Alert>
  )}
  {cart.success && (
    <Alert variant="success" className="p-2">
      {cart.success}
    </Alert>)}
</div>

            {/* Handle No Review */}
            {product.result.Review.length === 0 && (
              <Alert variant="info" className="p-2">
                There are no reviews currently for this product.
              </Alert>
            )}
            {/* </div> */}
  

          </>
        )}
  
        {/* Errors Handling */}
        {product.loading === false && product.err != null && (
          <Alert variant="danger" className="p-2">
            {product.err}
          </Alert>
        )}
  
        {!auth && (
          <Alert variant="warning" className="p-2">
            Please login first to be able to send a review.
          </Alert>
        )}
      </div>
    );
};

export default ProductInfo;
