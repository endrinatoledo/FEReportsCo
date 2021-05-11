import React, {useState} from 'react';
import { Table, ConfigProvider } from 'antd';
import { SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';

const TableList = ({ dataSource, footer}) => {

  const columns = [
    {
      title: 'Agrupación',
      dataIndex: 'group',
      key: 'group',
      align: 'left',
    },
    {
      title: 'Promedio de Ventas',
      dataIndex: 'averageSales',
      key: 'averageSales',
      align: 'right'
    },
    {
      title: 'Ventas Semana 1',
      dataIndex: 'firstWeek',
      key: 'firstWeek',
      align: 'right'
    },
    {
      title: 'Alcance',
      dataIndex: 'scope',
      key: 'scope',
      align: 'right',
      
    }
  ];
  
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} 
      columns={columns} 
      scroll={{ x: 800, y:300 }} 
      style={{ paddingTop:'1%', width: '100%' }} 
      footer={footer}
      pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50']}}
      />
      
      </ConfigProvider>
    )
}

export default TableList;
