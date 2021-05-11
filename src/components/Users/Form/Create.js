import React from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import Form from './Form';

const { Title } = Typography;

const List = (props) => {

  let content = (<div >
    <Row>
      <Col span={24}>
        <Title level={4}>Crear usuario</Title>           
      </Col>
      
    </Row>
    <Row>
      <Col span={24}>
        <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
      </Col>

    </Row>
    <Row>
      <Col xs={24} md={24} lg={24} xl={24}>

        <Form/>

      </Col>

    </Row>
    
    
    
    
  
</div>);
  return content;
}

export default List;