import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Cart.css";
import { getAuthUser } from "../../helper/Storage";
import StripeCheckout from "react-stripe-checkout";

const Cart = () => {
    const auth = getAuthUser();
    const [cart, setCart] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const [stripeToken, setStripeToken] = useState(null);
    const KEY =    "pk_test_51PCuYN04mHHplJjxEYF8QjDFCVbR8iTkJf5se0LD2Ysj3LxGByYcpum6RNMsFtUTKrrh6PMLvdIV559H62M0MoHQ00xtOnjmXq";
    const onToken = (token) => {    setStripeToken(token);
    };  
  

    useEffect(() => {
        fetchCart();
    }, []); // This effect runs only once when the component mounts

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/cart', {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            });
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
      const makeRequest = async () => {      try {
        
        const res = await axios.post(
            "http://localhost:8000/api/v1/cart/payment",
            {
                tokenId: stripeToken.id,
                amount: cart.totalPrice , // Assuming the amount is in cents
                Products: cart.products.map(product => ({
                  productId: product.productId,
                    productname: product.productname,
                    quantity: product.quantity,
                    productprice: product.productprice
                })),
                totalPrice: cart.totalPrice
            },

            {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            }
        );

                // Clear the cart
                await axios.put(
                  "http://localhost:8000/api/v1/cart",
                  {},
                  {
                      headers: {
                          Authorization: 'Bearer ' + auth.token
                      }
                  }
              );

              // Fetch the cleared cart
              fetchCart(); 

        console.log(res.data);
        
    } catch (err) {
        console.log(err.message);
    }
};
if (stripeToken && cart) {
    makeRequest();
}
}, [stripeToken, cart]);
    const handleIncrease = async (productId) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/cart/increase/${productId}`, null, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            });
            // After updating quantity, fetch the cart again to get the updated data
            fetchCart();
        } catch (error) {
            console.error('Error increasing quantity:', error);
        }
    };

    const handleDecrease = async (productId) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/cart/decrease/${productId}`, null, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            });
            // After updating quantity, fetch the cart again to get the updated data
            fetchCart();
        } catch (error) {
            console.error('Error decreasing quantity:', error);
        }
    };

    const deleteitem=(productId)=>{
        axios
          .delete(`http://localhost:8000/api/v1/cart/${productId}`,{
            headers:{
            Authorization: "Bearer "+ auth.token,
            },
          })
          .then((resp) => {
            fetchCart();
            setShowAlert(true); // Show the alert after successful deletion
            // Hide the alert after 2 seconds
            setTimeout(() => {
              setShowAlert(false);
            }, 2000);
  
          })
          .catch((err) => {});
      };

      return (
        <article>
          {cart && (
            <>
              {cart.products.map((product, index) => (
                <div key={index} className="cart_box">
                  <div className="cart_img">
                    <img src={product.productimage} alt={product.productname} />
                    <p>{product.productname}</p>
                  </div>
                  <div>
                    <button onClick={() => handleDecrease(product.productId)}> - </button>
                    <button>{product.quantity}</button>
                    <button onClick={() => handleIncrease(product.productId)} > + </button>
                  </div>
                  <div>
                    <span>{product.productprice}</span>
                  </div>
                  <button className="buttoncart" onClick={(e)=>{deleteitem(product.productId)}}>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 69 14"
                      class="svgIcon bin-top"
                    >
                      <g clip-path="url(#clip0_35_24)">
                        <path
                          fill="black"
                          d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_35_24">
                          <rect fill="white" height="14" width="69"></rect>
                        </clipPath>
                      </defs>
                    </svg>
    
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 69 57"
                      class="svgIcon bin-bottom"
                    >
                      <g clip-path="url(#clip0_35_22)">
                        <path
                          fill="black"
                          d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_35_22">
                          <rect fill="white" height="57" width="69"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              ))}
              <div className='total'>
                <span>Total Price of your Cart</span>
                <span>{cart.itemsPrice} EGP</span>
              </div>
              {cart.itemsPrice > 0 && (
  <>
              <div className="checkout"> 
 
      <h4>ORDER SUMMARY</h4> 
      <div className="order__type"> 
        <p>Subtotal</p> 
        <p>{cart.itemsPrice} EGP</p> 
      </div> 

      <div className="order__type"> 
        <p>Shipping Price</p> 
        <p>{cart.shippingPrice} EGP</p> 
         
      </div>
      <div className="order__type">
      <p>Tax Price</p> 
        <p>{cart.taxPrice} EGP</p>
      </div>
      <div className="order__type">
      <p style={{fontWeight:"bold", fontSize:25}}>Total Price</p> 
        <p style={{fontWeight:"bold", fontSize:20}}>{cart.totalPrice} EGP</p>
      </div>
 
      </div>
      </>
)}
    {cart.itemsPrice > 0 && (
              <StripeCheckout 
            name="Agriculture Investment" 
            image="/images/logo.jpeg" 
            billingAddress 
            shippingAddress 
            description={`yout total  is ${cart.totalPrice}`} 
            amount={cart.totalPrice * 100} 
            token={onToken} 
            stripeKey={KEY} 
    

          > 
                <button className="checkout__btn">CHECKOUT  </button> 
          </StripeCheckout> 
    
    )}

 
        {/* Check out */} 
        <div className="orders__right"> 
          {/* <Checkout />  */}
        </div> 
   
            </>
          )}
        </article>
      );
    }
    
    export default Cart;