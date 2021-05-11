import React, { useState } from 'react';

import {  Row, Col,Select  } from 'antd';


const Statusfilter = ({setSelectedKey, Reload, SetReload }) => {
    const onSelect = (SelectedKey) => {
        setSelectedKey(SelectedKey);
        SetReload(Reload+1)
    };

    return (
        <Row>
            <Col xs={24} md={24} lg={8} xl={8} >
                <Select onSelect={onSelect} placeholder="Estatus" defaultValue={"all"} style={{ minWidth: "20vw"}}>
                    <Select.Option value="all">Todos</Select.Option>
                    <Select.Option value="1">Activo</Select.Option>
                    <Select.Option value="0">Inactivo</Select.Option>
                </Select>
            </Col>
        </Row>
        
      )
  }
  
  export default Statusfilter;