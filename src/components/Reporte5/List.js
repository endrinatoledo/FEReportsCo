import React from 'react';
import { Table,  ConfigProvider } from 'antd';
import esp from 'antd/es/locale/es_ES';




const TableList = ({ dataSource, monthList}) => {

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      align: 'left',
      fixed: 'left',
      width: 150
    },
    {
      title: 'Marca',
      dataIndex: 'brand',
      key: 'brand',
      align: 'left',
      fixed: 'left'
    },
    {
      title: 'Artículo',
      dataIndex: 'item',
      key: 'item',
      align: 'left',
      fixed: 'left'
    },
    {
      title: 'Código',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'left'
    },
    {
      title: `${monthList[3]}`,
      align: 'center',
      children: [{
        title: `Cant. de Venta`,
      dataIndex: 'saleQuantityFour',
      key: 'saleQuantityFour',
      align: 'center'
      }]
      
    },
    {
      title: `${monthList[2]}`,
      align: 'center',
      children: [{
        title: `Cant. de Venta`,
      dataIndex: 'saleQuantityThree',
      key: 'saleQuantityThree',
      align: 'center'
      }]
      
    },
    {
      title: `${monthList[1]}`,
      align: 'center',
      children: [{
        title: `Cant. de Venta`,
        dataIndex: 'saleQuantityTwo',
        key: 'saleQuantityTwo',
        align: 'center'
      }]
      
    },
    {
      title: `${monthList[0]}`,
      align: 'center',
      children: [{
        title: `Cant. de Venta`,
        dataIndex: 'saleQuantityOne',
        key: 'saleQuantityOne',
        align: 'center'
      }]
      
    }
  ];
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} 
      expandable={{ defaultExpandAllRows : true }}
      columns={columns} 
      pagination={{ defaultPageSize: 10, 
      showSizeChanger: true, 
      pageSizeOptions: ['10', '20', '50']}} scroll={{ x: 800 }} defaultExpandAllRows style={{ paddingTop:'1%', width: '100%' }}/>
      
      </ConfigProvider>
    )
}

export default TableList;
