import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
// Components
import USERS_CREATE from '../Users/Form/Create';
import USERS_LIST from '../Users/List/List';
import REPORTE_ONE from '../Reporte1/Reporte1'
import REPORTE_TWO from '../Reporte2/Reporte2'
import REPORTE_THREE from '../Reporte3/Reporte3'
import REPORTE_FOUR from '../Reporte4/Reporte4'
import REPORTE_FIVE from '../Reporte5/Reporte5'
import BUSINESS_VIEW from '../Business/view';

// Icons
import {
  LogoutOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
const logoCofersa = require('../../assets/img/cofersa.jpg')
require('../../assets/css/custom.css')
require('../../assets/css/febeca.css');
const styles = {
  logo: logoCofersa,
  divider: '#01a2d8'
}
//localStorage.getItem("clientName").toUpperCase()
const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
const SiderMenu = () => {

  const [selected, setSelected] = useState(parseInt(localStorage.getItem('nav') === null ? (String(localStorage.getItem("rol")) !== "1" ? (String(localStorage.getItem("rol")) !== "4" ? 0 : 7) : 3) : localStorage.getItem('nav')))
  const getComponent = (select) =>{
    switch (String(select)) {
      case '2':
        return <USERS_CREATE divider={styles.divider} />;
      case '3':
        return <USERS_LIST divider={styles.divider} />;
      case '11':
        return <REPORTE_ONE divider={styles.divider} />;
        case '12':
        return <REPORTE_TWO divider={styles.divider} />;
        case '13':
        return <REPORTE_THREE divider={styles.divider} />;
        case '14':
        return <REPORTE_FOUR divider={styles.divider} />;
        case '15':
        return <REPORTE_FIVE divider={styles.divider} />;
        case '16':
          return <BUSINESS_VIEW  divider={styles.divider}/>
      default:
        return <REPORTE_ONE handler={setSelected} divider={styles.divider} />;
      }
    }
  const selectNav = (value) => {
    localStorage.setItem('nav', value)
    setSelected(value)
    }
  const logout = () => {
    window.location.href="/"
    localStorage.removeItem("usrId");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("client");
    localStorage.removeItem("clientName");
    localStorage.removeItem("rol");
    localStorage.removeItem('nav');
    localStorage.removeItem('sellerCode');
    localStorage.removeItem('idSupervisor');
    localStorage.removeItem('usrTeleventa');
    
    }

  return (
    <Layout>
      <Sider
        breakpoint="lg" collapsedWidth="0"
        onBreakpoint={broken => {}}
        onCollapse={(collapsed, type) => {}}
        >
        <a href="/">
          <img src={styles.logo} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px", maxWidth: '175px'}} alt="logo" />
          </a>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[String(localStorage.getItem('nav') === null ? (String(localStorage.getItem("rol")) !== "1" ? (String(localStorage.getItem("rol")) !== "4" ? 0 : 7) : 3) : localStorage.getItem('nav'))]} defaultOpenKeys={["sub1","sub2","sub3","sub4"]} >
          
            <Menu.Item icon={<FileTextOutlined />} key="11" onClick={() => selectNav(11)} className="customclass">
              Reporte 8020
            </Menu.Item>
            <Menu.Item icon={<FileTextOutlined />} key="12" onClick={() => selectNav(12)} className="customclass">
              8020 Semana 1
            </Menu.Item>
            <Menu.Item icon={<FileTextOutlined />} key="13" onClick={() => selectNav(13)} className="customclass">
              Marca por Clientes
            </Menu.Item>
            <Menu.Item icon={<FileTextOutlined />} key="14" onClick={() => selectNav(14)} className="customclass">
              Artículos por Clientes
            </Menu.Item>
            {String(localStorage.getItem("usrTeleventa")) !== "1" ? (
            <Menu.Item icon={<FileTextOutlined />} key="15" onClick={() => selectNav(15)} className="customclass">
              Surtido
            </Menu.Item>
             ) : null}
          
          
          {String(localStorage.getItem("rol")) === "0" || String(localStorage.getItem("rol")) === "1" ? (
            <SubMenu key="sub2" icon={<UserOutlined/>} title="Usuarios">
              <Menu.Item key="2" onClick={() => selectNav(2)} className="customclass">
                Crear
                </Menu.Item>
              <Menu.Item key="3" onClick={() => selectNav(3)} className="customclass">
                Lista de Usuarios
                </Menu.Item>
              </SubMenu>
            ) : null}
          {String(localStorage.getItem("rol")) === "0" || String(localStorage.getItem("rol")) === "1" ? (
            <Menu.Item icon={<SettingOutlined />} key="16" onClick={() => selectNav(16)} className="customclass">
              Días hábiles
              </Menu.Item>
            ) : null}
          <Menu.Item key="exit" icon={<LogoutOutlined />} className="customclass" onClick={logout}>
            Salir
            </Menu.Item>
          </Menu>
        </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <Title level={4} style={{paddingTop: "10px", paddingLeft:"20px", paddingBottom:"20px"}}> Sistema de Reporte de Ventas</Title>
          </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '85%',
            flex: 'none',
          }}>
          {getComponent(selected)}
          </Content>
        <Footer style={{  display:'table' }}>
          <div style={{display: 'table-cell', verticalAlign:'middle', fontWeight:'bold'}}> Intelix Synergy © 2020 </div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
//textAlign: 'center',
export default SiderMenu
