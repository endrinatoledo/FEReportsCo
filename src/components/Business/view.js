import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin, Button   } from 'antd';
import Form from './Form'


const axios = require('../../utils/request').default;

const { Title } = Typography;

const View = (props) => {


    const [dataSource, setDataSource] = useState(null)
    const [dates, SetDates] = useState([])
    let date = new Date();
    let options = {
        year: 'numeric',
        month: 'long'
      };
    const fillData = async (batch) => {
        const result = ((await axios.get("/hbl/") ).data)[0]
        setDataSource(result)
        const holidays = JSON.parse(result.hbl_holidays).map(el => checkDate(el))
        SetDates(holidays.length === 0 ? [] : holidays )
    }
    const checkDate = (data) => {
      const d = new Date(data.date);
      let month = '' + (d.getMonth() + 1),
          day = '' + d.getDate();
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [date.getFullYear(), month, day].join('-');
  }
    
    useEffect(() => {
        fillData()
    }, []);
  let content = (
    <div >

        <Row>
          <Col span={24}>
            <Title level={4}>Configuración de días hábiles - {date.toLocaleDateString('es-MX', options)}</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
          </Col>

        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
          {dataSource == null ? 
            <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> 
            : 
            <div style={{ marginTop: '50px' }}>
                <Form dates={dates} SetDates={SetDates} dataSource={dataSource}/>
                </div>
            
            }

          </Col>

        </Row>
    </div>
  );
  return content;
}

export default View;
