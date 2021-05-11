import React, {useState, useEffect} from 'react';
import { Modal, Form, message, Tooltip, Switch,Table, Button, Space, ConfigProvider , Input, Select, Tag } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import esp from 'antd/es/locale/es_ES';
// Constants
// Axios Defaults
const axios = require('../../../utils/request').default;






const TableList = () => {
  
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [toEdit, setToEdit] = useState({usrName: '', usrLastName: '', usrEmail: '', usrRol: "0"});
  const  setEdit = (value) => {
    setToEdit({...value})
    setVisible(true)
    }
  const onOk = () => {
    form
      .validateFields()
      .then(async values => {
            await axios.put('/users/'+ toEdit.usrId, { 
              usrName: (values.usrName === undefined ? toEdit.usrName : values.usrName), 
              usrLastName: (values.usrLastName === undefined ? toEdit.usrLastName : values.usrLastName), 
              usrEmail: (values.usrEmail === undefined ? toEdit.usrEmail : values.usrEmail),
              usrSellerCode: values.usrSellerCode
              })
            message.success("Usuario editado con exito"  )
            fillTable()
            setToEdit({usrName: '', usrLastName: 0, usrEmail: '', usrId: 0})
            setVisible(false)
            form.resetFields();
        
      });
  }
  const fillTable = async () => {
    const result = (await axios.get("/users") ).data
    console.log(result)
    setDataSource((result == [] ? [] : result.map((el, i) => {
      return {
        ...el,
        key: i,
        client: el.cliName
      }
    })
  ))
}
  const selectClient = async (e, value)=>{
    const r = await axios.put("/users/"+value.usrId, {...value, cliId: e })
    message.success("Cambio de casa exitoso"  )
    fillTable()
    }
  const selectRol = async (e, value)=>{
    const r = await axios.put("/users/"+value.usrId, {...value, usrRol: e })
    message.success("Cambio de rol exitoso"  )
    fillTable()
    }
  const roles = (value) => {
    if(String(value.usrRol) === "0"){
      return <>Desarrollo</>
      }else{
        return (
          <Tooltip title="Cambiar rol">
            <Select placeholder="Rol" defaultValue={String(value.usrRol)} onChange={(e)=>selectRol(e, value)}>
              <Select.Option value="1">Gerente de Logística</Select.Option>
              <Select.Option value="2">Supervisor</Select.Option>
              <Select.Option value="3">Vendedor</Select.Option>
              <Select.Option value="4">Televendedor</Select.Option>
              </Select>
            </Tooltip>
        )
      }
    }
  const clientes = (value)=> {
    return(
      <Tooltip title="Cambiar casa">
        <Select placeholder="Casa" defaultValue={String(value.cliId)} onChange={(e)=>selectClient(e, value)}>
          <Select.Option value="1">Beval</Select.Option>
          <Select.Option value="2">Febeca</Select.Option>
          <Select.Option value="3">Sillaca</Select.Option>
          </Select>          
        </Tooltip>)
    
  }
  const disableUser = async (value)=>{
    await axios.put("/users/"+value.usrId, {...value, usrStatus: (value.usrStatus === "0" ? "1" : "0") })
    console.log(value)
    message.success("Usuario " + (value.usrStatus !== "0" ? "habilitado " : "deshabilitado ")  )
    fillTable()
    }

  const action = (value) => {
    return(
      <>
        <Tooltip title="Editar usuario">
          <Button shape="round" onClick={() => setEdit(value)} icon={<EditOutlined />} size='small' />    
          </Tooltip>
        
        </>
      )
    }
    const statusRender = (value) => {
      if(value.usrStatus === "0"){
          return(
            <>
              <Tooltip title="Deshabilitar usuario">
                <Switch defaultChecked onChange={()=>disableUser(value)} />    
                </Tooltip>
              </>
          )
        }else{
          return(
            <Tooltip title="Habilitar usuario">
              <Switch defaultChecked={false}  onChange={()=>disableUser(value)} />             
              </Tooltip>)
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
      title: 'Nombres',
      dataIndex: 'usrName',
      key: 'usrName',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        if (a.usrName < b.usrName)
          return -1;
        if ( a.usrName > b.usrName)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('usrName','Nombres'),
    },
    {
      title: 'Apellidos',
      dataIndex: 'usrLastName',
      key: 'usrLastName',
      sorter: (a, b) => {
        if (a.usrLastName < b.usrLastName)
          return -1;
        if ( a.usrLastName > b.usrLastName)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('usrLastName','Apellidos'),
    },
    {
      title: 'Correo',
      dataIndex: 'usrEmail',
      key: 'usrEmail',
      sorter: (a, b) => {
        if (a.usrEmail < b.usrEmail)
          return -1;
        if ( a.usrEmail > b.usrEmail)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('usrEmail','Correo'),
    },
    {
      title: 'Casa',
      key: 'client',
      sorter: (a, b) => {
        if (a.client < b.client)
          return -1;
        if ( a.client > b.client)
          return 1;
        return 0;
      },
      render: clientes
    },
    {
      title: 'Rol',
      key: 'usrRol',
      render: roles,
      sorter: (a, b) => {
        if (a.client < b.client)
          return -1;
        if ( a.client > b.client)
          return 1;
        return 0;
      }
    },
    {
      title: "Código de vendedor",
      dataIndex: 'usrSellerCode',
      key:'usrSellerCode',
      align: "center"
    },
    {
      title: "Acción",
      render: action,
      align: "center"
    },
    {
      title: "Estado",
      render: statusRender,
      align: "center"
    }
  ];
  useEffect(() => {
    fillTable()
  }, []);
  useEffect(() => {
    form.resetFields()
  }, [toEdit]);
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} columns={columns} pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '20', '50']}} scroll={{ x: 800 }} style={{ paddingTop:'1%', width: '100%' }}/>
      <Modal
      visible={visible}
      title="Editar usuario"
      okText="Editar"
      cancelText="Cancelar"
      onCancel={() => {
        fillTable();
        setVisible(false);
      }}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={toEdit}
      >
        <Form.Item
          name='usrName'
          label="Nombres"
          >
          <Input placeholder="Nombres..." />
          </Form.Item>
        <Form.Item
          name='usrLastName'
          label="Apellidos"
          >
          <Input placeholder="Apellidos..." />
          </Form.Item>
        <Form.Item
          name='usrEmail'
          label="Correo"
          >
          <Input placeholder="Correo..." />
          </Form.Item>
          {String(toEdit.usrRol) === "4" ?
        (<Form.Item
          name='usrSellerCode'
          label="Código de vendedor"
          rules={[
            {
              required: true
            },
          ]}
        >
          <Input placeholder="Código de vendedor..." />
          </Form.Item>)
        : null
      }
        </Form>
    </Modal>
    </ConfigProvider>
    )
}

export default TableList;