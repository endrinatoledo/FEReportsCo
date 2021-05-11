import React, { useEffect, useState } from 'react';
import { Form, Typography, InputNumber, DatePicker, Button, ConfigProvider, message  } from 'antd';
import es_ES from 'antd/lib/locale/es_ES';
import en_US from 'antd/lib/locale/en_US';
import moment from 'moment';
import { FileAddOutlined, DeleteOutlined  } from '@ant-design/icons';

const axios = require('../../utils/request').default;

const { Title } = Typography;

const View = ({dates, SetDates, dataSource}) => {
    const [hbl5, setHbl5] = useState(dataSource.hbl_habiles_5)
    const initialValues = {
        days: dataSource !== null ? dataSource.hbl_days : 25
    }
    
    
    const addHoliday = () =>{
        SetDates([...dates, {id: dates.length, date: moment().startOf('month').format('YYYY-MM-DD')} ])
    }
    const editHolidays = (val, id) =>{
        let copy = dates;
        for (let index = 0; index < dates.length; index++) {
            if(dates[index].id === id){
                copy[index].date = val
            }
        }
        SetDates(copy)
    }
    const deleteHolidays = (id) =>{
        let copy = dates.filter( el => el.id !== id);
        copy = copy.map( (el, i) =>{
            return {
                id: i,
                date: el.date
            }
        } );
        SetDates(copy)
    }
    const onFinish = async (values) => {
        const data = {
            hbl_id: dataSource.hbl_id, 
            hbl_holidays: JSON.stringify(dates), 
            hbl_days: values.days, 
            hbl_habiles_5: hbl5.includes("T04:00:00.000Z") ? hbl5 : hbl5+"T04:00:00.000Z"
        }
        const result = (await axios.put("/hbl/", data) ).data
        if(result !== "ERROR"){
            message.success('¡Actualizado con exito!');
            }else{
                message.warning('¡Error actualizando los datos, por favor verifique los datos ingresados!');
            }
      };
    
    const disabledDate = (current) => {
        return current && !(current >= moment().startOf('month') && moment().startOf('month').add(1, 'month')  > current);
        }
    let content = (
        <ConfigProvider locale={es_ES}>
    <Form
        name="basic"
        onFinish={onFinish}
        initialValues={initialValues}
        >
        <Form.Item
            label={"Lunes de reporte"}
            name={"hbl_habiles_5"}
            >
                <ConfigProvider locale={en_US}>
                <DatePicker
                    onChange={(val, val2)=>{setHbl5(val2)}}
                    disabledDate={disabledDate}
                    placeholder={"Seleccione una fecha"}
                    defaultValue={moment(dataSource.hbl_habiles_5)}
                    />
                </ConfigProvider>
            </Form.Item>
        <Form.Item
            label="Cantidad de días"
            name="days"
            rules={[{ required: true }]}
            >
            <InputNumber max={30} min={1} />
            </Form.Item>
        {
        dates.length === 0 ? 
        (<div style={{marginBottom: "20px"}}>No hay días hábiles registrados</div>)
        : 
        dates.map( (element, i) =>{
            return (
                <Form.Item
                    label={"Día feriado #"+(i+1)}
                    name={"hbl_"+(i+1)}
                    >
                    <ConfigProvider locale={en_US}>
                        <DatePicker
                            onChange={(val, val2) => { editHolidays(val2, element.id)}}
                            disabledDate={disabledDate}
                            placeholder={"Seleccione una fecha"}
                            defaultValue={moment(element.date)}
                            />
                            </ConfigProvider>
                        </Form.Item>
                )
        })
        }

      <Form.Item>
        <Button 
            icon={<FileAddOutlined />} 
            style={{ marginRight: "15px"}} 
            onClick={addHoliday}
            >
            Añadir dia hábil
            </Button>
        <Button 
            icon={<DeleteOutlined />} 
            style={{ marginRight: "15px"}} 
            danger 
            onClick={()=>{deleteHolidays(dates.length-1)}} >
            Eliminar ultimo día
            </Button>
        <Button type="primary" htmlType="submit">
          Registrar cambios
        </Button>
      </Form.Item>
    </Form>
    </ConfigProvider>
  );
  return content;
}

export default View;
