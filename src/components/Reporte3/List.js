import React, {useState} from 'react';
import { Table, ConfigProvider } from 'antd';
import esp from 'antd/es/locale/es_ES';

const TableList = ({ dataSource}) => {

  const columns = [
    {
      title: 'Código Cliente',
      dataIndex: 'clientCode',
      key: 'clientCode',
      align: 'center'
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      align: 'left'
    },
    {
      title: 'Marca',
      dataIndex: 'brand',
      key: 'brand',
      align: 'left'
    },
    {
      title: 'Promedio de Ventas',
      dataIndex: 'averageSales',
      key: 'averageSales',
      align: 'right'
    },
    {
      title: 'Ventas del Mes',
      dataIndex: 'monthSales',
      key: 'monthSales',
      align: 'right'
    },
    {
      title: 'Alcance %',
      dataIndex: 'scope',
      key: 'scope',
      align: 'right',
    }
  ];
  return (
    <ConfigProvider locale={esp}>
      <Table 
      expandable={{ defaultExpandAllRows : true }}
      dataSource={dataSource} columns={columns} pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50']}} scroll={{ x: 800, y:400 }}  style={{ paddingTop:'1%', width: '100%' }}/>
      
      </ConfigProvider>
    )
}

export default TableList;
