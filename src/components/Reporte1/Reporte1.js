import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin, Button, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import List from './List';
import Abc from '../Filters/Abc'
import Collaborator from '../Filters/Collaborator'
import jsPDF from "jspdf";
import "jspdf-autotable";

const axios = require('../../utils/request').default;
const { Title } = Typography;

const View = (props) => {

  const [dataSource, setDataSource] = useState(null);
  const [Reload, SetReload] = useState(0);
  const [FilterABC, SetFilterABC] = useState();
  const [Collab, SetCollab] = useState();
  const [Totales, SetTotales] = useState({});
  const [rptDate, setRptDate] = useState("")
  const [connErr, setConnErr] = useState(false)

  const fillDate = async (batch) => {
    const result = (await axios.get("/report_date/1") ).data
    if(result.length != 0){
      setRptDate(new Date(result[0].rpt1_date))
      fillData()
    }else{
      setDataSource([])
    }
  }
  const fillData = async (batch) => {
    let grandtotal_avg_sales = 0
    let grandtotal_last_month  = 0
    let grandtotal_scope  = 0

    let filters = {}
    if(FilterABC !== undefined && FilterABC !== "0-0" && FilterABC !== ""){
      filters.ABC = FilterABC
    }
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
    let result = []
    try {
      result = (await axios.post("/report_1", filters) ).data
    } catch (error) {
      setConnErr(true)
    }
    if(result != "ERROR"){
      setDataSource((result == "Not Data" ? [] : result.map((el, i) => {
        grandtotal_avg_sales += Math.round(el.rpt1_avg_sales);
        grandtotal_last_month += Math.round(el.rpt1_last_month);
        grandtotal_scope += Math.round(el.rpt1_scope);
  
        return {
          ...el,
          key: i,
          group: (el.rpt1_group).toUpperCase(),
          averageSales: Math.round(el.rpt1_avg_sales).toLocaleString('en-EN'),
          previousMonthSales: Math.round(el.rpt1_last_month).toLocaleString('en-EN'),
          scope: (el.rpt1_scope === null ? 0 : parseFloat(el.rpt1_scope).toLocaleString('en-EN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%')   
          }
        })
        
      ))
      if(result.length !== 0 || result == "Not Data" || result == null){
        SetTotales(
          {//Totales
            averageSales: Math.round(grandtotal_avg_sales).toLocaleString('en-EN'),
            previousMonthSales: Math.round(grandtotal_last_month).toLocaleString('en-EN'),
            scope: (grandtotal_scope === null ? 0 : parseFloat(grandtotal_scope/result.length).toLocaleString('en-EN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) +"%")
          }
        )
      }else{
        SetTotales({//Totales      
          averageSales:0,
          previousMonthSales: 0,
          scope: 0 +"%"
        }
      )
      }
      
    }else{
      setConnErr(true)
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
    const title = "Clientes Representativos con Venta del Mes Anterior por debajo del Promedio de Ventas";
    const headers = [
      { header: 'Agrupación', dataKey: 'group' },
      { header: 'Promedio de Ventas', dataKey: 'averageSales' },
      { header: 'Ventas Mes Anterior', dataKey: 'previousMonthSales' },
      { header: 'Alcance', dataKey: 'scope' },
    ];

    let dataS;
    dataS = [ ...dataSource.map( value => { 
      return {
        group: (value.group).toUpperCase(),
        averageSales: value.averageSales,
        previousMonthSales: value.previousMonthSales,
        scope: value.scope+ '%'
      }
    }), 
      {//Totales
        averageSales: Totales.averageSales,
        previousMonthSales: Totales.previousMonthSales,
        scope: Totales.scope
      }]
    let d = rptDate;
    let date = d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear()
    doc.setFontSize(10);
    doc.text(date, 700, 100);
    doc.setFontSize(12);
    doc.text(title, 150, 100);
    doc.addImage(img, 'JPEG', 35, 30, 100, 50);
    //doc.autoTable(content);
    doc.autoTable({
      theme: 'grid',
      startY: 110,
      styles: { margin: 20  },
      headerStyles: {
        fillColor: "#3b82bd",
        halign:'center',
        lineWidth: 1,
        lineColor: [189, 195, 199]
      },
      columnStyles: {  
        0: {halign:'left'},
        1: {halign:'right'},
        2: {halign:'right'},
        3: {halign:'right'},
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
    doc.save("reporte 1.pdf")
  }

  const footer = () => {
    return(
      <Row>
      <Col xs={0} md={0} lg={6} xl={6}  style={{ textAlign: 'left', fontWeight: "bold" }}> Total General</Col>
      <Col xs={0} md={0} lg={6} xl={6} style={{ textAlign: 'right', fontWeight: "bold", paddingRight:"25px"  }} > {Totales.averageSales}</Col>
      <Col xs={0} md={0} lg={6} xl={6} style={{ textAlign: 'right', fontWeight: "bold", paddingRight:"23px" }} > {Totales.previousMonthSales}</Col>
      <Col xs={0} md={0} lg={6} xl={6} style={{ textAlign: 'right', fontWeight: "bold", paddingRight:"18px" }} > {Totales.scope}</Col>
    {/* xs y md */}
      <Col xs={24} md={24} lg={0} xl={0}  style={{ textAlign: 'left', fontWeight: "bold" }}> Total General</Col>
      <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold"  }} >Prom. Vts: {Totales.averageSales}</Col>
      <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold" }} >Vts mes Anterior: {Totales.previousMonthSales}</Col>
      <Col xs={24} md={24} lg={0} xl={0} style={{ textAlign: 'right', fontWeight: "bold" }} >Alcance: {Totales.scope}</Col>
    

    
    </Row>
    ) 

  }
  

  let content = (
    <div style={{paddingBottom: "50px"}}>

        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
            <Title level={4}>Clientes Representativos con Ventas del mes anterior por debajo de su promedio de compras</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col xs={24} md={24} lg={20} xl={20}>
          <Row> 
            <Col xs={24} md={24} lg={2} xl={2}>
            ABC: 
            </Col>  
            <Col xs={24} md={24} lg={22} xl={22}>
              <Abc setCheckedKeys={SetFilterABC} Reload={Reload} SetReload={SetReload}/>
            </Col> 
        </Row>  
        <Row> 
            <Col xs={24} md={24} lg={2} xl={2}>
              Vendedor:  
            </Col>  
            <Col xs={24} md={24} lg={22} xl={22}>
              <Collaborator SetCollab={SetCollab} Reload={Reload} SetReload={SetReload} setConnErr={setConnErr}/>
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
