import React, { useState } from 'react';

import { Row, Col,TreeSelect  } from 'antd';
const { SHOW_PARENT } = TreeSelect;


const listCollaborators = [
    {
      title: 'TODOS',
      key: '0-0',
      children: [
        {
          title: 'Enero',
          key: '0-0-0',
        },
        {
          title: 'Febrero',
          key: '0-0-1',
  
        },
        {
          title: 'Marzo',
          key: '0-0-2',
  
        },
        {
          title: 'Abril',
          key: '0-0-3',
  
        },
        {
          title: 'Mayo',
          key: '0-0-4',
  
        },
        {
          title: 'Junio',
          key: '0-0-5',
  
        },{
          title: 'Julio',
          key: '0-0-6',
        },
        {
          title: 'Agosto',
          key: '0-0-7',
  
        },
        {
          title: 'Septiembre',
          key: '0-0-8',
  
        },
        {
          title: 'Octubre',
          key: '0-0-9',
  
        },
        {
          title: 'Noviembre',
          key: '0-0-10',
  
        },
        {
          title: 'Diciembre',
          key: '0-0-11',
  
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