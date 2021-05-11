import React, { useState, useEffect } from 'react';
//import { TreeSelect  } from 'antd';
//const { SHOW_PARENT } = TreeSelect;
import { Row, Col, Select } from 'antd';
const { Option } = Select;
const axios = require('../../utils/request').default;


const Clientsfilter = ({Client, SetClient, Reload, SetReload, setConnErr }) => {
    const [listClient, SetListClient] = useState([]);

    const fillData = async () => {
      let filters = {}
      filters.UsrId = localStorage.usrId
        try {
          const  clientList = (await axios.post("/report_5/client", filters) ).data
          if(clientList != "ERROR"){
            if(clientList.length !== 0){          
              SetClient(clientList[0])
              SetListClient(clientList)
              SetReload(Reload+1)
            }else{
              SetListClient([])
            }   
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


    function onChange(value) {
      const clientData = listClient.filter( data => data.rpt5_client_code == value)
      SetClient(clientData[0])
      SetReload(Reload+1)
    }
    

    
    return (
      <Row>
          <Col xs={24} md={24} lg={8} xl={8} >
            <Select
                showSearch
                value={Client.rpt5_client_code}
                onChange={onChange}
                style={{ width: "100%", paddingRight: '2%'}}
                >
                {listClient.map(d => 
                  <Option key={d.rpt5_client_code} value={d.rpt5_client_code}>{d.rpt5_group +' ('+d.rpt5_client_code+')'}</Option>
                )}
          </Select>
          </Col>
      </Row>      
      )
    }
  
  export default Clientsfilter;