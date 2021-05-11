import React, { useState, useEffect } from 'react';

import { Row, Col, TreeSelect  } from 'antd';
const { SHOW_PARENT } = TreeSelect;
const axios = require('../../utils/request').default;

const BrandFilter = ({SetBrandFilter, Reload, SetReload, setConnErr }) => {
    const [SelectedClass, SetSelectedClass] = useState([])
    const fillData = async () => {
      try {
        const result = (await axios.get("/report_4/brand") ).data
        if(result != "ERROR"){
          SetSelectedClass(result.map( el => { return { title: el.rpt4_brand, key: el.rpt4_brand } }))
        }else{
          setConnErr(true)
        }
      } catch (error) {
        setConnErr(true)
      }
    }

    useEffect(() => {
      fillData()
      }, []);
    const onChange = (selected) => {
      let s = ""
      for (let index = 0; index < selected.length; index++) {
        if(index === 0){
          s = selected[index] ;
        }else{
          s += "|" + selected[index];
        }
      }
      SetBrandFilter(s);
      SetReload(Reload+1)
    };
    const listCollaborators = [
      {
        title: 'TODOS',
        key: '0-0',
        children: SelectedClass
      }
    ];
    return (
      <Row>
          <Col xs={24} md={24} lg={8} xl={8} >
          <TreeSelect 
            treeCheckable= {true}
            onChange={onChange}
            treeData={listCollaborators}
            showCheckedStrategy= {SHOW_PARENT}
            style={{ width: "100%", paddingRight: '2%'}}
            placeholder= {'Seleccionar'}
            defaultValue={"0-0"}
            />
          </Col>
      </Row>     
    
      )
  }
  
  export default BrandFilter;