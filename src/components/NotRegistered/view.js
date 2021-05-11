import React, { Component } from "react";
import { Result, Button } from 'antd';

function logout() {
    localStorage.removeItem("notReg");
    localStorage.removeItem("status");
    window.location.href="/"
  }
class View extends Component {
    render() {
      return (
        <Result
            status="error"
            title={localStorage.getItem("status") === null ? "Usuario no registrado" : "Usuario bloqueado"}
            subTitle="¡Contacte con el personal encargado y solicite ser registrado en la apliacion!"
            extra={[
                <Button type="primary" key="console" onClick={logout}>
                    Salir
                </Button>
            ]}
        />)
    }
}
export default View;