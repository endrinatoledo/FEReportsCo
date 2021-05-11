import React, { useState } from 'react';

import { Row, Col,TreeSelect  } from 'antd';
const { SHOW_PARENT } = TreeSelect;

const listCollaborators = [
    {
      title: 'TODOS',
      key: '0-0',
      children: [
        {
          title: '2015',
          key: '0-0-0',
        },
        {
          title: '2016',
          key: '0-0-1',
  
        },
        {
          title: '2017',
          key: '0-0-2',
  
        },
        {
          title: '2018',
          key: '0-0-3',
  
        },
        {
          title: '2019',
          key: '0-0-4',
  
        },
        {
          title: '2020',
          key: '0-0-5',
  
        }
      ],
    }
  ];

const Yearfilter = ({ dataSource}) => {
    const [checkedKeys, setCheckedKeys] = useState();

    const onCheck = (checkedKeys) => {
      console.log('onCheck', checkedKeys);
      setCheckedKeys(checkedKeys);
    };
    
    return (
      <Row>
        <Col xs={24} md={24} lg={8} xl={8} >
          <TreeSelect 
            treeCheckable= {true}
            onCheck={onCheck}
            treeData={listCollaborators}
            showCheckedStrategy= {SHOW_PARENT}
            style={{ width: "20vw"}}
            placeholder= {'Seleccionar Año'} />
        </Col>
      </Row>
   
      )
  }
  
  export default Yearfilter;