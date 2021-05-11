import React, { useState } from 'react';

import { Row, Col, Select  } from 'antd';


const Companyfilter = ({setSelectedKey, Reload, SetReload }) => {
    const onSelect = (SelectedKey) => {
        setSelectedKey(SelectedKey);
        SetReload(Reload+1)
    };

    return (
        <Row>
          <Col xs={24} md={24} lg={8} xl={8} >
            <Select onSelect={onSelect} placeholder="Compañía" defaultValue={"COFER"} style={{ width: "100%", paddingRight: '2%'}} disabled>            
                <Select.Option >Cofersa</Select.Option>
            </Select>
          </Col>
        </Row>
        
      )
  }
  /*<Select.Option value="0">Cofersa</Select.Option>*/
  export default Companyfilter;