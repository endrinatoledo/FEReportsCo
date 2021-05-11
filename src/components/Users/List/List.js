import React from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import TableList from './tableList';

const { Title } = Typography;

const List = (props) => {

  let content = (
    <div style={{height: "100vh"}}>

        <Row>
          <Col span={24}>
            <Title level={4}>Listado de usuarios</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
          </Col>

        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>

            <TableList/>

          </Col>

        </Row>
        
        
        
        
      
    </div>
  );
  return content;
}

export default List;