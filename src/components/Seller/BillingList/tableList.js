import React, {useState, useEffect} from 'react';
import { Table, Button, Space, Tooltip, Input, ConfigProvider, Tag } from 'antd';
import { FilePdfOutlined, SearchOutlined } from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';

// Constants
// Axios Defaults
const axios = require('../../utils/request').default;





const TableList = ({ selectedBatch }) => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const pdf = (value) => {
    return (
      <Tooltip title="Pdf">
          <Button shape="round" href={process.env.REACT_APP_API_BASE_URL + "/public"+value.fileRoute.split("./tmp/pdf")[1]} target="_blank" icon={<FilePdfOutlined />} size='small' />
                       
      </Tooltip>
    )
  }
  const sendedRender = (value) => {
    if(value.invSended === "true"){
        return( <Tag color="green">Enviado</Tag>)
      }else{
        return( <Tag color="red">Sin enviar</Tag>)
      }
    }
  const date = (value) => {
    return (
      <>
        {new Date(value.invReleaseDate).toLocaleString('es').split(" ")[0].split("/").join("-")}
        </>
      )
    }
  const fillTable = async () => {
    if(selectedBatch == "all"){
      const result = (await axios.get("/invoices") ).data
      setDataSource((result == "Not Data" ? [] :result.filter( fil => fil.clients.cliId == localStorage.getItem("client"))
      .filter( fil2 => fil2.partners !=null )
      .filter( data => String(data.invSeller) === String(localStorage.getItem("sellerCode")))
      .map((el, i) => {
        return {
          ...el, key: i, invPrt: el.partners.prtName
        }
      })))
    }else{
      const result = (await axios.get("/invoices/invoicesByBatch/" + selectedBatch) ).data
      setDataSource((result == "Not Data" ? [] : result
      .filter( data => String(data.invSeller) === String(localStorage.getItem("sellerCode")))
      .map((el, i) => {
        return {
          ...el, key: i
        }
      })))
    }
    
  }
  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            TableList.searchInput = node;
          }}
          placeholder={`Buscar ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => TableList.searchInput.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };
  const columns = [
    {
      title: 'Factura Nro',
      dataIndex: 'invNumber',
      key: 'invNumber',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        if (a.invNumber < b.invNumber)
          return -1;
        if ( a.invNumber > b.invNumber)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('invNumber','Factura Nro'),
    },
    {
      title: 'Fecha de emisión',
      key: 'invReleaseDate',
      align: 'center',
      render: date,
      sorter: (a, b) => {
        if (a.invReleaseDate < b.invReleaseDate)
          return -1;
        if ( a.invReleaseDate > b.invReleaseDate)
          return 1;
        return 0;
      },
    },
    {
        title: 'Viaje',
        dataIndex: 'invTrip',
        key: 'invTrip',
        align: 'center',
        sorter: (a, b) => {
          if (a.invTrip < b.invTrip)
            return -1;
          if ( a.invTrip > b.invTrip)
            return 1;
          return 0;
        },
        ...getColumnSearchProps('invTrip','Viaje'),
    },
    {
      title: 'Cliente',
        dataIndex: 'invPrt',
        key: 'invPrt',
        align: 'left',
        sorter: (a, b) => {
          if (a.invPrt < b.invPrt)
            return -1;
          if ( a.invPrt > b.invPrt)
            return 1;
          return 0;
        },
        ...getColumnSearchProps('invPrt','Cliente'),
    },
    {
      title: 'Estado',
      render: sendedRender,
      align: 'center'
    },
    {
        title: 'Archivo',
        render: pdf,
        align: 'center'
    }
  ];
  useEffect(() => {
    setDataSource([])
    fillTable()
  }, [selectedBatch]);
  
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource.filter( el => "false" === el.readError )} columns={columns} pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '20', '50']}} scroll={{ x: 800 }} style={{ paddingTop:'1%', width: '100%' }}/>
      </ConfigProvider>
    )
}

export default TableList;
