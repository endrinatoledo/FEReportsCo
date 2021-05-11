import React, {useState} from 'react';
import { Table, ConfigProvider } from 'antd';
import esp from 'antd/es/locale/es_ES';


const TableList = ({ dataSource, footer}) => {


  const columns = [
    {
      title: 'Código Cliente',
      dataIndex: 'clientCode',
      key: 'clientCode',
      align: 'center',
      width: 150,
      //fixed: 'center',
    },{
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      align: 'left',
      width: 200,
      //fixed: 'left',
    },
    {
      title: 'Artículo',
      dataIndex: 'article',
      key: 'article',
      align: 'left',
      width: 100,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      width: 350,
    },
    {
      title: 'Promedio de Ventas',
      dataIndex: 'averageSales',
      key: 'averageSales',
      align: 'center',
      width: 150,
    },{
      title: 'Promedio de Ventas (UNID)',
      dataIndex: 'averageSalesUnits',
      key: 'averageSalesUnits',
      align: 'center',
      width: 150,
    },
    {
      title: 'Ventas del Mes (UNID)',
      dataIndex: 'salesMonth',
      key: 'salesMonth',
      align: 'center',
      width: 150,
    }
  ];
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} 
            expandable={{ defaultExpandAllRows : true }}
             columns={columns}  
             pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50']}} 
             scroll={{ x: 800, y:400 }}  
             style={{ paddingTop:'1%', width: '100%' }}
             footer={footer}/> 
      
      </ConfigProvider>
    )
}

export default TableList;
