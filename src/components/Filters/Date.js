import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/es_ES';

const Datefilter = ({SetDateFilter, Reload, SetReload }) => {

    const onChange = (date, dateString) => {
        SetDateFilter(dateString);
        SetReload(Reload+1)
    };
    
    return (
        <Row>
          <Col xs={24} md={24} lg={8} xl={8} >
            <DatePicker 
                onChange={onChange}
                picker="month"
                locale={locale}
                defaultValue={moment(new Date(), 'YYYY-MM-DD')} 
                />
          </Col>
        </Row>
        
      )
  }
  
  export default Datefilter;