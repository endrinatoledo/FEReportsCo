import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin, Button, message  } from 'antd';
import List from './List';
import Company from '../Filters/Company'
import Clientsfilter from '../Filters/Clients'
import { FilePdfOutlined } from '@ant-design/icons';
import jsPDF from "jspdf";
import "jspdf-autotable";
const axios = require('../../utils/request').default;
//console.log({axios})

const { Title } = Typography;

const View = (props) => {
  const [dataSource1, setDataSource1] = useState(null)
  const [monthList, setMonthListtClients] = useState([]);
  const [Reload, SetReload] = useState(0);
  const [Client, SetClient] = useState('');
  const [DataPdf, setDataPdf] = useState([]);
  const [rptDate, setRptDate] = useState("")
  const [connErr, setConnErr] = useState(false)

  const fillDate = async (batch) => {
    const result = (await axios.get("/report_date/5") ).data
    if(result.length != 0){
      setRptDate(new Date(result[0].rpt5_date))
      fillData()
    }else{
      setDataSource1([])
    }
  }
  const fillData = async (batch) => {
    let filters = {}
    try {
      const lastFourMonths = (await axios.post("/report_5/month/") ).data
      if(lastFourMonths != "ERROR"){
        let month = []
        if(lastFourMonths.length !== 0){
          lastFourMonths.forEach(element => {
            let meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
            let ms = Date.parse(element.month);
            let fecha = new Date(ms);
            month.push(`${meses[fecha.getMonth()] } ${fecha.getFullYear()}`)
          });
          setMonthListtClients(month)
        }else{
          setMonthListtClients([])
        }    
      if(Client.rpt5_client_code){
        filters.clientCode = Client.rpt5_client_code
        const dataToOrder = (await axios.post("/report_5", filters) ).data
        let data=[]
        if(dataToOrder != "ERROR"){
          if(dataToOrder.length !== 0){
            setDataPdf(dataToOrder)
            for (let index = 0; index < dataToOrder.items.length; index++) {
              if(dataToOrder.items[index].rpt5_class !== 0){
                data.push({
                key: '1'+index, 
                client: "",
                brand: dataToOrder.items[index].rpt5_class, 
                item:"", 
                itemCode:"",
                saleQuantityFour:dataToOrder.items[index].subTotal.sumVtaCantidad1, 
                saleQuantityThree:dataToOrder.items[index].subTotal.sumVtaCantidad2,
                saleQuantityTwo:dataToOrder.items[index].subTotal.sumVtaCantidad3, 
                saleQuantityOne:dataToOrder.items[index].subTotal.sumVtaCantidad4, 
                children:[]
              })
              for (let index1 = 0; index1 < dataToOrder.items.length; index1++) {
                if(dataToOrder.items[index].children[index1] !== undefined){
                data[index].children.push({
                key:  '1'+index + '-0-' + index1, 
                client: "",
                brand: "", 
                item:dataToOrder.items[index].children[index1].rpt5_description, 
                itemCode:dataToOrder.items[index].children[index1].rpt5_article_code,
                saleQuantityFour:Math.round(dataToOrder.items[index].children[index1].rpt5_vtaCantidad_1), 
                saleQuantityThree:Math.round(dataToOrder.items[index].children[index1].rpt5_vtaCantidad_2),
                saleQuantityTwo:Math.round(dataToOrder.items[index].children[index1].rpt5_vtaCantidad_3), 
                saleQuantityOne:Math.round(dataToOrder.items[index].children[index1].rpt5_vtaCantidad_4), 
                
              })
              }
    
            } 
              }
    
          }
          let dataF=[{ 
            key: '1', 
            client: Client.rpt5_group,
            brand: "", 
            item:"", 
            itemCode:"",
            saleQuantityFour:dataToOrder.total.sumVtaCantidad1, 
            saleQuantityThree:dataToOrder.total.sumVtaCantidad2,
            saleQuantityTwo:dataToOrder.total.sumVtaCantidad3,
            saleQuantityOne:dataToOrder.total.sumVtaCantidad4, 
            children:data
          }];
            
            setDataSource1(dataF)
    
          }else{
            setDataSource1([]);
          }
        }else{
          setConnErr(true)
          setMonthListtClients([])
          setDataSource1([]);
        }
        
    }else{
      setDataSource1(null);
    }
      }else{
        setConnErr(true)
        setMonthListtClients([])
        setDataSource1([]);
      }
    } catch (error) {
      
    }

    

  }
  useEffect(() => {
    setDataSource1(null)
    fillDate()
    }, [Reload]);
  useEffect(() => {
    if(connErr){
      setDataSource1([])
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
      const title = "Instructivo Reporte Información de Surtido";
      const headers = [
        { header: 'CLIENTE', dataKey: 'client',  },
        { header: 'MARCA', dataKey: 'brand' },  
        { header: 'ARTÍCULO', dataKey: 'item' },      
        { header: 'CÓDIGO', dataKey: 'itemCode' },
        { header: `${((monthList[3]).toUpperCase()).substr(0,3)}\nCANT VTA`, dataKey: 'saleQuantityFour' },
        { header: `${((monthList[2]).toUpperCase()).substr(0,3)}\nCANT VTA`, dataKey: 'saleQuantityThree' },
        { header: `${((monthList[1]).toUpperCase()).substr(0,3)}\nCANT VTA`, dataKey: 'saleQuantityTwo' },
        { header: `${((monthList[0]).toUpperCase()).substr(0,3)}\nCANT VTA`, dataKey: 'saleQuantityOne' },
      ];

      let dataS=[];
      let x;

      if(DataPdf.items.length !== 0){

      dataS.push({
        client: Client.rpt5_group,
        brand:"",
        item: "",
        itemCode: "",
        saleQuantityFour: DataPdf.total.sumVtaCantidad4,
        saleQuantityThree:DataPdf.total.sumVtaCantidad2,
        saleQuantityTwo:DataPdf.total.sumVtaCantidad2,
        saleQuantityOne:DataPdf.total.sumVtaCantidad1,
      });


        DataPdf.items.forEach(element => {

          dataS.push({
            client:"",
            brand:element.rpt5_class,
            item: "",
            itemCode: "",
            saleQuantityFour: element.subTotal.sumVtaCantidad4,
            saleQuantityThree:element.subTotal.sumVtaCantidad3,
            saleQuantityTwo:element.subTotal.sumVtaCantidad2,
            saleQuantityOne:element.subTotal.sumVtaCantidad1,
          });
          if(element.children.length !== 0){
            element.children.forEach(element_ => {
              dataS.push({
                client:"",
                brand:"",
                item: element_.rpt5_description,
                itemCode: element_.rpt5_article_code,
                saleQuantityFour: Math.round(element_.rpt5_vtaCantidad_4),
                saleQuantityThree:Math.round(element_.rpt5_vtaCantidad_3),
                saleQuantityTwo:Math.round(element_.rpt5_vtaCantidad_2),
                saleQuantityOne:Math.round(element_.rpt5_vtaCantidad_1),
              });
            })
          }
          //

        })

      }

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
          //fontSize:6
        },
        columnStyles: {  
          0: {halign:'left'},
          1: {halign:'left', columnWidth: 70},
          2: {halign:'left'},
          3: {halign:'center'},
          4: {halign:'right', columnWidth: 60},
          5: {halign:'right', columnWidth: 60},
          6: {halign:'right', columnWidth: 60},
          7: {halign:'right', columnWidth: 60},
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
    
      doc.save("reporte 5.pdf")

    }


  let content = (
    <div style={{paddingBottom: "50px"}}>
    
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
            <Title level={4}>Surtido</Title>           
          </Col>          
        </Row>        
        <Row>
          <Col xs={24} md={24} lg={20} xl={20}>
          <Row> 
            <Col xs={24} md={24} lg={2} xl={2}>
              Compañía: 
            </Col>  
            <Col xs={24} md={24} lg={22} xl={22}>
              <Company />
            </Col> 
        </Row> 
          <Row> 
              <Col xs={24} md={24} lg={2} xl={2}>
                Clientes: 
              </Col>  
              <Col xs={24} md={24} lg={22} xl={22}>
                <Clientsfilter Client={Client} SetClient={SetClient} Reload={Reload} SetReload={SetReload} setConnErr={setConnErr}/>
              </Col> 
          </Row> 
          </Col>
          <Col  xs={24} md={24} lg={4} xl={4} style={{ paddingTop:'2%', paddingRight: '2%' }}>
            <Button type="primary" style={{width:'100%', paddingLeft: '5%', paddingRight: '2%' }}  size="large" icon={<FilePdfOutlined style={{ fontSize: '20px' }}/>} 
            onClick={
              ()=>{ 
                if(dataSource1 != null && dataSource1 != [] && !connErr)
                {
                  if(dataSource1.length != 0){
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
          {dataSource1 == null ? <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> : 
          <>
            <div>Fecha de elaboración: {rptDate == "" ? "No se pudo obtener la fecha": rptDate.getDate() + "/" + (rptDate.getMonth() +1) + "/" + rptDate.getFullYear()}</div>
            <List dataSource={dataSource1} monthList={monthList} />
            </>}
    
          </Col>
    
        </Row>
    </div>
    );
    return content;
    
}

export default View;
