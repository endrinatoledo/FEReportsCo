import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
import { message } from 'antd';
import "../../assets/css/login.css"
const axios = require('../../utils/request').default;

const responseGoogle = async (response) => {
  if(response){
    if(response.profileObj){
      try {
        //console.log(response.profileObj)
        const user = await axios.post('/auth', {email: response.profileObj.email})
        if(user.data != "ERROR"){
          if(user.data.usrId){
            if(user.data.usrStatus === "0"){
              localStorage.setItem("usrId", user.data.usrId);
              localStorage.setItem("email", response.profileObj.email);
              localStorage.setItem("name", user.data.usrName + " " + user.data.usrLastName);
              localStorage.setItem("client", user.data.cliId);
              localStorage.setItem("clientName", user.data.cliName);
              localStorage.setItem("rol", user.data.usrRol);
              localStorage.setItem("sellerCode", user.data.usrSellerCode);
              localStorage.setItem("idSupervisor", user.data.usrIdSupervisor);
              localStorage.setItem("usrTeleventa", user.data.usrTeleventa);  
              localStorage.setItem("token", user.data.token);
              localStorage.setItem("notReg", false);
            }else{
              localStorage.setItem("notReg", true);
              localStorage.setItem("status", true);
            }
          }else{
            localStorage.setItem("notReg", true);
          }
          window.location.reload();
        }else{
          message.error('¡Error de conexión!');
        }
      } catch (error) {
        message.error('¡Error de conexión!');
      }
    }
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.OnClick2 = this.OnClick2.bind(this);
  };
  OnClick2 (){
    message.error('Este formulario se encuentra desactivado');
  }
  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }
    render() {
      return (
        <div className="register-photo">
            <div className="form-container">
                <div className="image-holder"></div>
                    <form method="post">
                        <div className="logo"></div>
                        <p className="text-center"><strong>Inicio de sesión</strong></p>
                        <div className="form-group"><input disabled className="form-control" type="email" name="email" placeholder="Correo" value={this.state.email} onChange={this.handleEmailChange} ></input></div>
                        <div className="form-group"><input disabled className="form-control" type="password" name="password" placeholder="Contraseña"></input></div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" type="button" disabled onClick={this.OnClick2}><strong>Iniciar Sesión</strong></button>
                        </div>
                        <hr></hr>
                        <GoogleLogin 
                            className="btn btn-google btn-block"
                            clientId={process.env.REACT_APP_CLIENT_ID_GOOGLE}
                            buttonText="Iniciar Sesión con Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle} 
                        />
                        <hr></hr>
                    </form> 
  
            </div>
        </div>
      );
    }
  }
export default Login;