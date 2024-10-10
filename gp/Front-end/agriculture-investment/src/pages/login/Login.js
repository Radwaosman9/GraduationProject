
import React, { useState,useEffect } from "react";
import "./Login.css";

import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { setAuthUser } from "../../helper/Storage";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/system/Unstable_Grid';
import { Link } from "react-router-dom";



const Login = () =>{
    const navigate = useNavigate();
    const [login, setLogin] = useState({
    email: "",
    password: "",
      loading: false,
      err: [],
    });
    useEffect(() => {
      if (login.err.length > 0 || login.success) {
        const timer = setTimeout(() => {
          setLogin({
            ...login,
            err: [],
            success: null,
          });
        }, 2000);
  
        return () => clearTimeout(timer);
      }
    }, [login.err, login.success]);
  
    const LoginFun = (e) => {
      e.preventDefault();
      setLogin({ ...login, loading: true, err: [] });
      axios
        .post("http://localhost:8000/api/v1/auth/login", {
            email: login.email,
            password: login.password,
        })
        .then((resp) => {
          setLogin({ ...login, loading: false, err: [] });
          setAuthUser(resp.data);
          navigate("/");
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.errors) {
            setLogin({ ...login, loading: false, err: error.response.data.errors });
          } else {
            setLogin({
              ...login,
              loading: false,
              err: [{ msg: "email or password is not correct try agin!" }],
            });
          }
        });
    }
    return (
      <>
      <div className="login-background">
        <Grid container xs={12} sm={12} md={12} xl={12} lg={12} className="cover">
            {/* <img src="./images/farm3.webp" alt="login"/> */}
            <Grid container xs={12} sm={12} md={3} xl={3} lg={3} className="form">
                <h2>Login </h2>
                
                <div className="logininput">
                <input  type="text" placeholder=" Enter Email" required
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })} />
                <input type="password" placeholder="Enter password" required
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                </div>
                <div className="login-btn">
                    <button onClick={LoginFun}>login</button>
                </div>
                <Link className="R" to={'/register'}>Create an account?</Link>
            </Grid>
            </Grid>
            </div>
            <div className="alert-container1">
          {login.err.map((error, index) => (
            <Alert key={index} variant="danger" className="p-2">
              {error.msg}
            </Alert>
          ))}
          {login.success && (
            <Alert variant="success" className="p-2">
              {login.success}
            </Alert>
          )}
        </div>
            </>
    );
};
export default Login ;