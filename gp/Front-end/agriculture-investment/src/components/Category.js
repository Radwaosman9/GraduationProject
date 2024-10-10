import React, { useState, useEffect } from "react";
import "../styles/Category.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Grid from '@mui/system/Unstable_Grid';

const Cards = () => {
    const [category, setcategory] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0,
    });

    useEffect(() => {
        setcategory({ ...category, loading: true });
        axios
            .get("http://localhost:8000/api/v1/categories")
            .then((resp) => {
                setcategory({ ...category, results: resp.data, loading: false, err: null });
            })
            .catch((err) => {
                setcategory({
                    ...category,
                    loading: false,
                    err: " something went wrong, please try again later! ",
                });
            });
    }, [category.reload]);

    return (
        <Grid container xs={12} sm={12} md={12} xl={12} lg={12} className="full-width-container">
        <div className="container">
            {category.results.map((category) => (
                <Grid item xs={12} sm={12} md={4} xl={4} lg={4} className="card-container" key={category._id}>
                    <div className="image-container">
                        <img src={category.image} alt={category.name} />
                    </div>
                    <div className="buttonc">
                        <button>
                            <Link to={"/" + category._id}>{category.name}</Link>
                        </button>
                    </div>
                </Grid>
            ))}
            {category.loading === false && category.err != null && (
                <Alert variant="danger" className="p-2">
                    {category.err}
                </Alert>
            )}

            {category.loading === false && category.err == null && category.results.length === 0 && (
                <Alert variant="info" className="p-2">
                    No category, please try again later!
                </Alert>
            )}
            </div>
        </Grid>
        
    );
};

export default Cards;
