import React, { useState, useEffect } from "react";
import "./Register.css";
// import { Link } from "react-router-dom";
// import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { setAuthUser } from "../../helper/Storage";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/system/Unstable_Grid';
import Alert from "react-bootstrap/Alert";


const Register = () =>{
    const navigate = useNavigate();
  const [register, setRegister] = useState({
    email: "",
    password: "",
    name: "",
    phone:"",
    address:"",
    passwordConfirm:"",
    loading: false,
    err: [],
  });

  useEffect(() => {
    if (register.err.length > 0 || register.success) {
      const timer = setTimeout(() => {
        setRegister({
          ...register,
          err: [],
          success: null,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [register.err, register.success]);

  const RegisterFun = (e) => {
    e.preventDefault();
    setRegister({ ...register, loading: true, err: [] });
    axios
      .post("http://localhost:8000/api/v1/auth/signup", {
        email: register.email,
        password: register.password,
        name: register.name,
        phone:register.phone,
        address:register.address,
        passwordConfirm:register.passwordConfirm
      })
      .then((resp) => {
        setRegister({ ...register, loading: false, err: [] });
        setAuthUser(resp.data);
        navigate("/Login");
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          setRegister({ ...register, loading: false, err: error.response.data.errors });
        } 
      });
  };
    return (
      <div className="login-background">
        {register.err.length > 0 && (
            <div className="alert-container1">
              {register.err.map((error, index) => (
                <Alert key={index} variant="danger" className="p-2">
                  {error.msg}
                </Alert>
              ))}
            </div>
          )}
        <Grid container xs={12} sm={12} md={12} xl={12} lg={12} className="cover">
            {/* <img src="./images/farm3.webp" alt="login"/> */}
            <Grid container xs={12} sm={12} md={3} xl={3} lg={3} className="form">
            <div classname="form1">
            <h2 className="hh2">Register Form</h2>
               <div className="registerinput">
               <div className="name"> <input type="text" placeholder=" Enter name" required
               value={register.name} onChange={(e) =>
              setRegister({ ...register, name: e.target.value })
            } /></div>
                <div className="us"><input type="text" placeholder=" Enter Email" required
               value={register.email} onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }/></div>
                <div className="ps"><input type="password" placeholder="Enter password" required
               value={register.password} onChange={(e) =>
              setRegister({ ...register, password: e.target.value })
            }/></div>
                <div className="cs"><input type="password" placeholder="Confirm password" required
               value={register.passwordConfirm} onChange={(e) =>
              setRegister({ ...register, passwordConfirm: e.target.value })
            }/></div>
                <div className="ph"> <input type="text" placeholder=" Enter Your Phone number" required
               value={register.phone} onChange={(e) =>
              setRegister({ ...register, phone: e.target.value })
            } /></div>
                <div className="addr"> <input type="text" placeholder=" Enter Your Address" required
               value={register.address} onChange={(e) =>
              setRegister({ ...register, address: e.target.value })
            } /></div>
                </div>
                <div className="register-btn">
                    <button onClick={RegisterFun} disabled={register.loading === true}>
                        Submit</button>
                </div>
            </div>
            </Grid>
            </Grid>
        </div>
    );
};
export default Register ;