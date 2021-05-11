import React, { useState } from 'react';

import { Row, Col, TreeSelect  } from 'antd';
const { SHOW_PARENT } = TreeSelect;
const treeData = [
  {
    title: 'TODOS',
    key: '0-0',
    children: [
      {
        title: 'A',
        key: 'A',
      },
      {
        title: 'B',
        key: 'B',

      },
      {
        title: 'C',
        key: 'C',

      }
    ],
  }
];

const Abcfilter = ({setCheckedKeys, Reload, SetReload }) => {
    const onChange = (selected) => {
      let s = "";
      for (let index = 0; index < selected.length; index++) {
        if(index === 0){
          s = selected[index] ;
        }else{
          s += "|" + selected[index];
        }
      }
      setCheckedKeys(s);
      SetReload(Reload+1)
    };
    
    return (
      <Row>
          <Col xs={24} md={24} lg={8} xl={8} >
            <TreeSelect 
              treeCheckable= {true}
              onChange={onChange}
              treeData={treeData}
              showCheckedStrategy= {SHOW_PARENT}
              style={{ width: "100%", paddingRight: '2%'}}
              placeholder= {'Clasificación de Cliente'} 
              defaultValue={"0-0"}
              />
          </Col>
      </Row>
    

      )
  }
  
  export default Abcfilter;