import React, { useState, useEffect } from "react";
import "../styles/Info.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Grid from '@mui/system/Unstable_Grid';


const Info = () => {
  const [info, setinfo] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect (() => {
    setinfo({ ...info, loading: true });
    axios
      .get("http://localhost:8000/api/v1/Informations/getonlytwo")
      .then((resp) => {
        console.log(resp)
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
    return (
        <>
        <div className="background-image" >
        <div className="info">
        <h1 className="hinfo">Informations</h1>
        <div className="buttonc">
                    <button > <Link to={"/Info"}>View All Articles</Link> </button>
                </div>
                <Grid container xs={12} sm={12} md={12} xl={12} lg={12}  Spacing={2} className="cardss.container">
        <Grid item  xs={12} sm={12} md={8} xl={8} lg={8} className="infocard">
        {info.results.map((info) => (
        <div class="card mb-5" key={info._id}>
        <div className="cardo" class="row g-0">
          <div className="infoimage" class="col-md-3">
            <img src={info.image} class="img-fluid rounded-start" alt="..."/>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{info.name}</h5>
              <p class="card-text">{info.information}</p>
              <p class="card-text"><small class="text-body-secondary">{"Updated At: "+info.updatedAt}</small></p>
            </div>
            {/* <div>
                <button className="cta">
                <Link to="" className=" create btn btn-success mb-3 "> Read More </Link>
          </button>
          </div> */}
          </div>
          
        </div>
        </div>
        ))};
        
      </Grid>
      </Grid>
      </div>
      </div>
      </> 
    );
};
export default Info;