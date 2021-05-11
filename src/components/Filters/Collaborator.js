import React, { useState, useEffect } from 'react';
import { Row, Col, TreeSelect  } from 'antd';

const { SHOW_PARENT } = TreeSelect;
const axios = require('../../utils/request').default;
const Collaboratorfilter = ({SetCollab, Reload, SetReload, setConnErr }) => {
    const [listCollaborators, SetListCollaborators] = useState([])
    const fillData = async () => {

      if(localStorage.rol == '3'){ // rol vendedor
        SetListCollaborators( [{ title: localStorage.name, key: localStorage.sellerCode }] )
      }

      if(localStorage.rol == '2'){ // rol supervisor

        try {
          const  sellersList = await axios.get('/usersIdSupervisor/'+localStorage.usrId)
       
        if(sellersList != "ERROR"){
          const dataS = sellersList.data.map( el => { return { title:`${el.usrName + ' ' +  el.usrLastName}`, key: `${el.usrName + ' ' +  el.usrLastName}`, usrSellerCode: `${el.usrSellerCode}`} })
          SetListCollaborators ( [
            {
              title: 'TODOS',
              key: '0-0',
              children: dataS

            }
            ])
          }else{
            setConnErr(true)
          }
        } catch (error) {
          setConnErr(true)
        }
      }

      if(localStorage.rol == '1' || localStorage.rol == '4'){ // rol vendedor
        
        try {          
          let data_=[];
          const sellersList = await axios.get('/usersFilterCollaborator')
          if(sellersList != "ERROR"){
            for (let index = 0; index < sellersList.data.length; index++) {              
              data_.push({
                title:`${sellersList.data[index].supervisor.usrName + ' ' +  sellersList.data[index].supervisor.usrLastName}`, 
                key: `${sellersList.data[index].supervisor.usrName + ' ' +  sellersList.data[index].supervisor.usrLastName}`,
                children:[], 
                usrSellerCode: `${sellersList.data[index].usrSellerCode}`
              })
              for (let index2 = 0; index2 < sellersList.data[index].vendors.length; index2++) {
                data_[index].children.push({
                  title:`${sellersList.data[index].vendors[index2].usrName + ' ' +  sellersList.data[index].vendors[index2].usrLastName}`, 
                  key: `${sellersList.data[index].vendors[index2].usrName + ' ' +  sellersList.data[index].vendors[index2].usrLastName}`, 
                  usrSellerCode: `${sellersList.data[index].vendors[index2].usrSellerCode}`
                })              
              }
            }
            SetListCollaborators ([
              {
                title: 'TODOS',
                key: '0-0',
                children: data_
              }])
          }        
        } catch (error) {
          setConnErr(true)
        }        
      }
    }

    useEffect(() => {
      fillData()
      }, []);
    const onChange = (selected, d) => {
      let s = ""
      if(selected[0] == "0-0"){
        for (let index = 0; index < listCollaborators[0].children.length; index++) {
          if(listCollaborators[0].children[index].children){
            let element = listCollaborators[0].children[index]
            if(s == "" && element.usrSellerCode != null && element.usrSellerCode != undefined && element.usrSellerCode != "undefined"){
              s= element.sellerCode
            }
            for (let index2 = 0; index2 < element.children.length; index2++) {
              if(s == ""){
                s = element.children[index2].usrSellerCode ;
              }else{
                s += "|" + element.children[index2].usrSellerCode;
              }
            }

          }else if(s == ""){
            s = listCollaborators[0].children[index].usrSellerCode ;
          }else{
            s += "|" + listCollaborators[0].children[index].usrSellerCode;
          }
        }
      }else{
        for (let index = 0; index < selected.length; index++) {
          let element = listCollaborators[0].children.filter( el => el.key == selected[index])
          if(element.length != 0){
            if(s == "" && element[0].usrSellerCode != null&& element[0].usrSellerCode != undefined && element[0].usrSellerCode != "undefined"){
              s= element[0].sellerCode
            }
            for (let index2 = 0; index2 < element[0].children.length; index2++) {
              if(s == ""){
                s = element[0].children[index2].usrSellerCode ;
              }else{
                s += "|" + element[0].children[index2].usrSellerCode;
              }
            }

          }else if(s == ""){
            const filt = listCollaborators[0].children.map(el => el.children)
            for (let index2 = 0; index2 < filt.length; index2++) {
              let element2 = filt[index2].filter( el => el.key == selected[index])
              if(element2.length != 0){
                s =  element2[0].usrSellerCode;
              }
            }
            
          }else{
            const filt = listCollaborators[0].children.map(el => el.children)
            for (let index2 = 0; index2 < filt.length; index2++) {
              let element2 = filt[index2].filter( el => el.key == selected[index])
              if(element2.length != 0){
                s += "|" + element2[0].usrSellerCode;
              }
            }
          }
        }
      }
      SetCollab(s);
      SetReload(Reload+1)
    };
    
    return (
      <Row>
          <Col xs={24} md={24} lg={8} xl={8}>
          <TreeSelect
            treeCheckable= {true}
            onChange={onChange}
            treeData={listCollaborators}
            showCheckedStrategy= {SHOW_PARENT}
            style={{ width: "100%", paddingRight: '2%'}}
            placeholder= {'Seleccionar'}
            defaultValue={listCollaborators}
       />
          </Col>
      </Row>
    
      )
  }
  
  export default Collaboratorfilter;