import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin, Button, message } from 'antd';
import List from './List';
import Collaborator from '../Filters/Collaborator'
import Classification from '../Filters/Classification'
import Brand from '../Filters/Brand'
import { FilePdfOutlined } from '@ant-design/icons';

import jsPDF from "jspdf";
import "jspdf-autotable";
const axios = require('../../utils/request').default;

const { Title } = Typography;

const View = (props) => {


    const [dataSource, setDataSource] = useState(null)
    const [Reload, SetReload] = useState(0);
    const [Collab, SetCollab] = useState();
    const [ClassFilter, SetClassFilter] = useState();
    const [BrandFilter, SetBrandFilter] = useState();
    const [listClients, setListClients] = useState([]);
    const [fullClients, setFullClients] = useState([]);
    const [Totales, SetTotales] = useState({ averageSales:0, grandTotalAvgSsalesUnits:0, salesMonth: 0 })
    const [rptDate, setRptDate] = useState("")
    const [connErr, setConnErr] = useState(false)

    const fillDate = async (batch) => {
      const result = (await axios.get("/report_date/4") ).data
      if(result.length != 0){
        setRptDate(new Date(result[0].rpt4_date))
        fillData()
      }else{
        setDataSource([])
      }
    }
    const fillData = async (batch) => {
      let filters = {};
      if(Collab !== undefined && Collab !== "0-0" && Collab !== ""){
        filters.SellerName = Collab
      } 
      if(ClassFilter !== undefined && ClassFilter !== "0-0" && ClassFilter !== ""){
        filters.Class = ClassFilter
      } 
      if(BrandFilter !== undefined && BrandFilter !== "0-0" && BrandFilter !== ""){
        filters.Brand = BrandFilter
      }
      if(localStorage.rol == '3'){ //rol de vendedor
        filters.SellerCode = localStorage.sellerCode
      }
  
      if(localStorage.rol == '2'){ //rol de supervisor
        filters.UsrId = localStorage.usrId
        filters.SellerCode = localStorage.sellerCode
      }
      filters.Rol = localStorage.rol; 


      try {
        const clients = (await axios.post("/report_4/top20clients", filters) ).data
        if(clients != "ERROR"){
          setListClients(clients)
      filters.Clients = clients;

      const result = (await axios.post("/report_4", filters) ).data
          if(result != "ERROR"){
            setFullClients(result)
            let data = [],
            j = 0,
            grandtotal_avg_sales = 0,
            grandtotal_avg_sales_units  = 0,
            grandtotal_month_sales_units  = 0;
            if(result.length !== 0 && clients.length !== 0){
              for (let index = 0; index < clients.length; index++) {
                data.push({
                  key: index, 
                  clientCode: clients[index].rpt4_client_code,
                  client: clients[index].rpt4_group, 
                  article:"", 
                  description:"",
                  averageSales:"", 
                  averageSalesUnits:"",
                  salesMonth:"", 
                  children:[]
                })
                j = 0;
                for (let index2 = 0; index2 < result.length; index2++) {
                  if(result[index2].rpt4_client_code === clients[index].rpt4_client_code){
                    grandtotal_avg_sales += Math.round(result[index2].rpt4_avg_sales);
                    grandtotal_avg_sales_units += Math.round(result[index2].rpt4_avg_sales_units);
                    grandtotal_month_sales_units += Math.round(result[index2].rpt4_month_sales_units);
                    j++;
                    data[index].children.push({ "key": index + '-0-' + index2, "clientCode": "", "client": "","article": result[index2].rpt4_article, "description":result[index2].rpt4_description, "averageSales": Math.round(result[index2].rpt4_avg_sales).toLocaleString('en-EN'),"averageSalesUnits": Math.round(result[index2].rpt4_avg_sales_units).toLocaleString('en-EN') , "salesMonth": Math.round(result[index2].rpt4_month_sales_units).toLocaleString('en-EN') })
                    if(j == result[index2].count_avg_sales){ 
                      data[index].children.push({ "key":index + '-0-' + index2+"-"+index2, "clientCode": "Total " + result[index2].rpt4_client_code, "client":"", "article": "", "averageSales": Math.round(result[index2].sum_avg_sales).toLocaleString('en-EN'), "averageSalesUnits": Math.round(result[index2].sum_avg_sales_units).toLocaleString('en-EN') , "salesMonth": Math.round(result[index2].sum_month_sales_units).toLocaleString('en-EN') })
                    }
                  } 
                }
              }
              SetTotales({
                averageSales: grandtotal_avg_sales,
                grandTotalAvgSsalesUnits: grandtotal_avg_sales_units,
                salesMonth: grandtotal_month_sales_units
              });
              setDataSource(data); 
            }else{
              SetTotales({
                averageSales:0,
                grandTotalAvgSsalesUnits:0,
                salesMonth: 0
              });
              setDataSource([]);
            }
          }else{
            setConnErr(true)
            setListClients([])
            setFullClients([])
            setDataSource([]);
            SetTotales({ averageSales:0, grandTotalAvgSsalesUnits:0, salesMonth: 0 })
          }
        }else{
          setConnErr(true)
          setListClients([])
          setFullClients([])
          setDataSource([]);
          SetTotales({ averageSales:0, grandTotalAvgSsalesUnits:0, salesMonth: 0 })
        }
      } catch (error) {
        setConnErr(true)
        setListClients([])
        setFullClients([])
        setDataSource([]);
        SetTotales({ averageSales:0, grandTotalAvgSsalesUnits:0, salesMonth: 0 })
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
  const footer = () => {
    return(
      <Row>
        <Col xs={0} md={0} lg={6} xl={6} style={{ textAlign: 'left', fontWeight: "bold"}}> Total General</Col>
        <Col xs={0} md={0} lg={9} xl={9} style={{ textAlign: 'right', fontWeight: "bold" }}>  </Col>
        <Col xs={0} md={0} lg={3} xl={3} style={{ textAlign: 'right', fontWeight: "bold", paddingRight:"3%" }} > {Math.round(Totales.averageSales).toLocaleString('en-EN')}</Col>
        <Col xs={0} md={0} lg={3} xl={3} style={{ textAlign: 'right', fontWeight: "bold", paddingRight:"5%" }} > {Math.round(Totales.grandTotalAvgSsalesUnits).toLocaleString('en-EN')}</Col>
        <Col xs={0} md={0} lg={3} xl={3} style={{ textAlign: 'right', fontWeight: "bold", paddingRight:"6%" }} > {Math.round(Totales.salesMonth).toLocaleString('en-EN')}</Col>
        {/* xs y md */}
        <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'left', fontWeight: "bold"}}> Total General</Col>
        <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold" }}>  </Col>
        <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold" }} >Prom. Vts:  {Math.round(Totales.averageSales).toLocaleString('en-EN')}</Col>
        <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold" }} >Prom. Vts (UNID) : {Math.round(Totales.grandTotalAvgSsalesUnits).toLocaleString('en-EN')}</Col>
        <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold" }} >Vts. Mes :  {Math.round(Totales.salesMonth).toLocaleString('en-EN')}</Col>
      
      </Row>
      
    ) 

  }

  const exportPDF = () => {
    const unit = "pt";
    const size = "letter"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const doc = new jsPDF(orientation, unit, size);
  
    doc.setFontSize(12);
    var img = new Image()
    img.src = '/img/client/cofersa.jpg'
    const title = "Artículos Representativos";
    const headers = [
      { header: 'CÓDIGO CLIENTE', dataKey: 'rpt4_client_code' },
      { header: 'CLIENTE', dataKey: 'rpt4_group',  },
      { header: 'ARTÍCULO', dataKey: 'article' },
      { header: 'DESCRIPCIÓN', dataKey: 'description' },
      { header: 'PROM VTAS', dataKey: 'averageSales' },
      { header: 'PROM VTAS UNID', dataKey: 'avgSalesUnits' },
      { header: 'VTAS MES ACTUAL UNID', dataKey: 'monthSalesUnits' },
    ];
  
    let dataS=[];
    let x;

    listClients.forEach(element => {
  
      dataS.push(element);
      x = 0;
  
      fullClients.forEach(value => {
        if(value.rpt4_client_code === element.rpt4_client_code){
          x++;
          dataS.push({
            article:value.rpt4_article,
            description:value.rpt4_description,
            averageSales: Math.round(value.rpt4_avg_sales).toLocaleString('en-EN'),
            avgSalesUnits: parseInt(value.rpt4_avg_sales_units),
            monthSalesUnits: Math.round(value.rpt4_month_sales_units).toLocaleString('en-EN')
          })
  
          if(x == value.count_avg_sales){
            dataS.push({
              rpt4_client_code:`Total`,
              rpt4_group:element.rpt4_client_code,
              averageSales: Math.round(value.sum_avg_sales).toLocaleString('en-EN'),
              avgSalesUnits: Math.round(value.sum_avg_sales_units).toLocaleString('en-EN'),
              monthSalesUnits: Math.round(value.sum_month_sales_units).toLocaleString('en-EN')
        
            })          
          }        
        }
      }) 
    });
    
    dataS.push({
      rpt4_client_code:`Total`,
      rpt4_group:`General`,
      averageSales:Math.round(Totales.averageSales).toLocaleString('en-EN'),
      avgSalesUnits:Math.round(Totales.grandTotalAvgSsalesUnits).toLocaleString('en-EN'),
      monthSalesUnits: Math.round(Totales.salesMonth).toLocaleString('en-EN')
    })
   
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
        0: {halign:'right'},
        1: {halign:'left'},
        2: {halign:'right'},
        3: {halign:'left'},
        4: {halign:'right'},
        5: {halign:'right'},
        6: {halign:'right'},
      },
      body: dataS,
      columns: headers,
      willDrawCell: function (cell, data) {
        if (cell.row.index === dataS.length - 1) {
            doc.setTextColor(255, 255, 255);
            cell.cell.styles.fontStyle = "bold"
            doc.setFillColor(59, 131, 189)
        }
      }
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
  
    doc.save("reporte 4.pdf")
  }

  let content = (
    <div style={{paddingBottom: "50px"}}>

        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
            <Title level={4}>Artículos por Clientes</Title>           
          </Col>
          
        </Row>
        
        <Row>
          <Col xs={24} md={24} lg={20} xl={20}>
          <Row> 
            <Col xs={24} md={24} lg={2} xl={2} >
              Vendedor: 
            </Col>  
            <Col xs={24} md={24} lg={22} xl={22} >
              <Collaborator SetCollab={SetCollab} Reload={Reload} SetReload={SetReload} setConnErr={setConnErr}/>
            </Col> 
        </Row> 
          <Row> 
              <Col  xs={24} md={24} lg={2} xl={2}>
                Clasificación: 
              </Col>  
              <Col xs={24} md={24} lg={22} xl={22}>
                <Classification SetClassFilter={SetClassFilter} Reload={Reload} SetReload={SetReload} setConnErr={setConnErr}/>
              </Col> 
          </Row> 
          <Row> 
              <Col  xs={24} md={24} lg={2} xl={2}>
                Marca: 
              </Col>  
              <Col xs={24} md={24} lg={22} xl={22}>
                <Brand SetBrandFilter={SetBrandFilter} Reload={Reload} SetReload={SetReload} setConnErr={setConnErr}/>
              </Col> 
          </Row>
          </Col>
          <Col xs={24} md={24} lg={4} xl={4} style={{ paddingTop:'2%', paddingRight: '2%' }}>
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
            <List dataSource={dataSource} footer={footer}/>
            </>
          }

          </Col>

        </Row>
    </div>
  );
  return content;
}

export default View;
