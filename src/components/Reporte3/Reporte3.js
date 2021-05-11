import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin, Button, message } from 'antd';
import List from './List';
import Collaborator from '../Filters/Collaborator'
import { FilePdfOutlined } from '@ant-design/icons';
import jsPDF from "jspdf";
import "jspdf-autotable";

const axios = require('../../utils/request').default;


const { Title } = Typography;

const View = (props) => {
  const [dataSource, setDataSource] = useState(null);
  const [Reload, SetReload] = useState(0);

  const [Collab, SetCollab] = useState();
  const [listClients, setListClients] = useState([]);
  const [fullClients, setFullClients] = useState([]);
  const [rptDate, setRptDate] = useState("")
  const [connErr, setConnErr] = useState(false)


  const fillDate = async (batch) => {
    const result = (await axios.get("/report_date/3") ).data
    if(result.length != 0){
      setRptDate(new Date(result[0].rpt3_date))
      fillData()
    }else{
      setDataSource([])
    }
  }
  const fillData = async (batch) => {
    let filters = {}
    if(localStorage.rol == '3'){ //rol de vendedor
      filters.SellerCode = localStorage.sellerCode
    }

    if(localStorage.rol == '2'){ //rol de supervisor
      filters.UsrId = localStorage.usrId
      filters.SellerCode = localStorage.sellerCode
    }

    if(Collab !== undefined && Collab !== "0-0" && Collab !== ""){
      filters.SellerName = Collab
    }  
    filters.Rol = localStorage.rol; 
    try {
      const clients = (await axios.post("/report_3/top20clients", filters) ).data
      if(clients != "ERROR"){
        setListClients(clients)
        filters.Clients = clients;
        const result = (await axios.post("/report_3", filters) ).data
        if(result != "ERROR"){
          setFullClients(result)
          let data = [];
          if(result.length !== 0 && clients.length !== 0){
            let j;
            for (let index = 0; index < clients.length; index++) {
              data.push({
                key: index, 
                clientCode: clients[index].rpt3_client_code,
                client: clients[index].rpt3_group, 
                brand:"", 
                averageSales:"", 
                monthSales:"", 
                scope:"",
                children:[]
              })
              j = 0;
              for (let index2 = 0; index2 < result.length; index2++) {
                if(result[index2].rpt3_client_code === clients[index].rpt3_client_code){
                  j++;
                  data[index].children.push({ "key": index + '-0-' + index2, "clientCode": "", "client": "","brand": result[index2].rpt3_brand, "averageSales": Math.round(result[index2].rpt3_avg_sales).toLocaleString('en-EN'), "monthSales": Math.round(result[index2].rpt3_month_sales).toLocaleString('en-EN'), "scope": (result[index2].rpt3_scope_perc === null ? 0 : Math.round(result[index2].rpt3_scope_perc)) + "%" })
                  if(j == result[index2].count_scope_perc){ 
                    data[index].children.push({ "key":index + '-0-' + index2+"-"+index2, "clientCode": "Total " + result[index2].rpt3_client_code, "client":"", "brand": "", "averageSales": Math.round(result[index2].sum_avg_sales).toLocaleString('en-EN'), "monthSales": Math.round(result[index2].sum_month_sales).toLocaleString('en-EN'), "scope": ((result[index2].prom_scope_perc === null ? 0 :  Math.round(result[index2].prom_scope_perc))).toLocaleString('en-EN') + "%" })
                  }
                } 
              }
            }
            setDataSource(data);  
          }else{
            setDataSource([]);
          }
        }else{
          setConnErr(true)
          setFullClients([])
          setListClients([])
        }
      }else{
        setConnErr(true)
        setFullClients([])
        setListClients([])
      }
    } catch (error) {
      setConnErr(true)
      setFullClients([])
      setListClients([])
    }
}
useEffect(() => {
    setDataSource(null)
    fillDate()
}, [Reload]);
useEffect(() => {
  if(connErr){
    setDataSource([])
    message.error('¡Error de conexión!');
  }
}, [connErr]);
const exportPDF = () => {
  const unit = "pt";
  const size = "letter"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);
  var img = new Image()
  img.src = '/img/client/cofersa.jpg'
  const title = "Clientes con Alto Promedio de Ventas por Marca y baja Venta en el Mes";
  const headers = [
    { header: 'CÓDIGO CLIENTE', dataKey: 'rpt3_client_code' },
    { header: 'CLIENTE', dataKey: 'rpt3_group',  },
    { header: 'MARCA', dataKey: 'brand' },
    { header: 'PROMEDIO VTAS', dataKey: 'averageSales' },
    { header: 'VTAS DEL MES', dataKey: 'monthSales' },
    { header: 'ALCANCE', dataKey: 'scope' },
  ];

  let dataS=[];
  let x;
  listClients.forEach(element => {

    dataS.push(element);
    x = 0;

    fullClients.forEach(value => {
      if(value.rpt3_client_code === element.rpt3_client_code){
        x++;
        dataS.push({
          brand:value.rpt3_brand,
          averageSales: Math.round(value.rpt3_avg_sales).toLocaleString('en-EN'),
          monthSales: Math.round(value.rpt3_month_sales).toLocaleString('en-EN'),
          scope:  (value.rpt3_scope_perc === null ? 0 : parseFloat(value.rpt3_scope_perc)).toLocaleString('en-EN', {minimumFractionDigits: 2, maximumFractionDigits: 2})+ '%'
        })

        if(x == value.count_scope_perc){
          dataS.push({
            rpt3_client_code:`Total `,
            rpt3_group:element.rpt3_client_code,
            averageSales: Math.round(value.sum_avg_sales).toLocaleString('en-EN'),
            monthSales: Math.round(value.sum_month_sales).toLocaleString('en-EN'),
            scope: (value.rpt3_scope_perc === null ? 0 : parseFloat(value.prom_scope_perc)).toLocaleString('en-EN', {minimumFractionDigits: 2, maximumFractionDigits: 2})+ '%'
      
          })          
        }        
      }
    })     
  });
  let d = rptDate;
  let date = d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear()
  doc.setFontSize(10);
  doc.text(date, 700, 100);
  doc.setFontSize(12);
  doc.text(title, 150, 100);
  doc.addImage(img, 'JPEG', 35, 30, 100, 50);
  //doc.autoTable(content);
  doc.autoTable({
    //theme: 'grid',
    startY: 110,
    styles: { margin: 20  },
    headerStyles: {
      fillColor: "#3b82bd",
      halign:'center',
      lineWidth: 1,
      lineColor: [189, 195, 199]
    },
    columnStyles: {  
      0: {halign:'center'},
      1: {halign:'left'},
      2: {halign:'left'},
      3: {halign:'right'},
      4: {halign:'right'},
      5: {halign:'right'},
    },
    body: dataS,
    columns: headers
  })

    const pages = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;  //Optional
    const pageHeight = doc.internal.pageSize.height;  //Optional
    doc.setFontSize(9);  //Optional
        
    for (let j = 1; j < pages + 1 ; j++) {
          let horizontalPos = pageWidth / 2;  //Can be fixed number
          let verticalPos = pageHeight - 10;  //Can be fixed number
          doc.setPage(j);
          doc.text(`${j}/${pages}`, horizontalPos, verticalPos, {align: 'right'  //Optional text styling});
    })
    }

  doc.save("reporte 3.pdf")
}

  let content = (
    <div style={{paddingBottom: "50px"}}>

        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
            <Title level={4}>Marca por Clientes</Title>           
          </Col>
          
        </Row>
        <Row>
        <Col xs={24} md={24} lg={20} xl={20}>  
        <Row> 
            <Col xs={24} md={24} lg={2} xl={2}>
              Vendedor:  
            </Col>  
            <Col xs={24} md={24} lg={22} xl={22}>
              <Collaborator  SetCollab={SetCollab} Reload={Reload} SetReload={SetReload} setConnErr={setConnErr}/>
            </Col> 
        </Row>         
        </Col>
        <Col  xs={24} md={24} lg={4} xl={4} style={{ paddingTop:'2%', paddingRight: '2%' }}>
        <Button type="primary" style={{width:'100%', paddingLeft: '5%', paddingRight: '2%' }}  size="large" icon={<FilePdfOutlined style={{ fontSize: '20px' }}/>} 
            onClick={
              ()=>{ 
                if(dataSource != null && dataSource != [] && !connErr)
                {
                  if(dataSource.length != 0){
                    exportPDF()
                  }else{
                    message.error('No se puede generar el archivo PDF');
                  }
                }else{
                  message.error('No se puede generar el archivo PDF');
                }
              }}
              >
                Exportar Reporte 
          </Button>
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
          <>
            <div>Fecha de elaboración: {rptDate == "" ? "No se pudo obtener la fecha": rptDate.getDate() + "/" + (rptDate.getMonth() +1) + "/" + rptDate.getFullYear()}</div>
            <List dataSource={dataSource} />
            </>
          }

          </Col>

        </Row>
    </div>
  );
  return content;
}

export default View;
