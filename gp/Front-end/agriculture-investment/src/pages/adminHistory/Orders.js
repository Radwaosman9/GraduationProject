import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthUser } from "../../helper/Storage";
import '../history/History.css'

const Order = () => {
    const auth = getAuthUser();
    const [history, setHistory] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0,
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setHistory({ ...history, loading: true });
                const response = await axios.get("http://localhost:8000/api/v1/cart/history", {
                    headers: {
                        Authorization: "Bearer " + auth.token,
                    },
                });
                console.log("API response:", response.data); // Debug log
                setHistory({ ...history, results: response.data, loading: false, err: null });
            } catch (error) {
                console.error("Error fetching history:", error); // Debug log
                setHistory({
                    ...history,
                    loading: false,
                    err: "Something went wrong, please try again later!",
                });
            }
        };

        fetchHistory();
    }, [history.reload]);

    if (history.loading) {
        return <div>Loading...</div>;
    }

    if (history.err) {
        return <div>{history.err}</div>;
    }

    if (!history.results.length) {
        return <div>No history found.</div>;
    }

    return (
        <>
              <h1 className='head'>History</h1>
            {history.results.map((order, orderIndex) => (
                
                <div key={order._id} className="order">
                 <h4 className='user' >User Name: {order.User.name} </h4>
                <h5 className='datee'>Order Date: {new Date(order.date).toLocaleString()}</h5>
                   
                    {order.cart.map((product, productIndex) => (
                        <div key={productIndex} className="cart_box">
                            <div className="cart_img">
                                <p>{product.productname}</p>
                            </div>
                            <div>
                                <button>{product.quantity}</button>
                            </div>
                            <div>
                                <span>{product.productprice} EGP</span>
                            </div>
                        </div>
                    ))}
                <h4 className='totals' >Total Price: {order.totalPrice} EGP</h4>
                </div>
            ))}
        </>
    );
}

export default Order;