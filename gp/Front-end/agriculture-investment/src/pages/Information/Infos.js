import React, { useState, useEffect } from "react";
import "./Infos.css";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Grid from '@mui/system/Unstable_Grid';

const Infos = () => {
  const [infos, setInfos] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setInfos({ ...infos, loading: true });
    axios
      .get("http://localhost:8000/api/v1/Informations")
      .then((resp) => {
        console.log(resp);
        setInfos({ ...infos, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setInfos({
          ...infos,
          loading: false,
          err: " something went wrong, please try again later! ",
        });
      });
  }, [infos.reload]);

  return (
    <>
      <h1 className="info1">Informations</h1>
      <Grid container xs={12} sm={12} md={12} xl={12} lg={12} spacing={2} className="info2">
        {infos.results.map((info) => (
          <Grid item xs={12} sm={12} md={8} xl={8} lg={8} className="infocard2" key={info._id}>
            <div className="card mb-5">
              <div className="row g-0 cardo">
                <div className="col-md-3 infoimage2">
                  <img src={info.image} alt="" />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <h5 className="card-title">{info.name}</h5>
                    <p className="card-text">{info.information}</p>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        ))}
        {infos.loading === false && infos.err != null && (
          <Alert variant="danger" className="p-2">
            {infos.err}
          </Alert>
        )}
        {infos.loading === false && infos.err == null && infos.results.length === 0 && (
          <Alert variant="info" className="p-2">
            No information, please try again later!
          </Alert>
        )}
      </Grid>
    </>
  );
};

export default Infos;
