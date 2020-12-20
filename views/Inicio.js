import React, {useEffect, useState} from 'react';
import { Text, FlatList, View } from 'react-native';
import axios from 'axios';
import { List, Headline, Button, FAB } from 'react-native-paper';
import GlobalStyle from '../styles/global';


const Inicio = ({navigation}) => {

    const [clientes, guardarClientes] = useState([]);
    const [consultarApi, guardarConsultarApi] = useState(true);

    useEffect( () =>{

        const obtenerClientesApi = async ()=>{
            try {
                const resultado = await axios.get('http://10.0.2.2:3000/clientes');
                guardarClientes(resultado.data);
                guardarConsultarApi(false);
            } catch (error) {
                console.log(error);
            }
        }

        if(consultarApi){
            obtenerClientesApi();
        }

    },[consultarApi])

    return (
        <View style={GlobalStyle.contenedor}>

            <Button icon="plus-circle" onPress={ ()=> navigation.navigate("NuevoCliente", {guardarConsultarApi}) }>
                Nuevo cliente
            </Button>

            <Headline style={GlobalStyle.titulo}>
                {clientes.length > 0 ? "clientes" : "aun no hay clientes"}
            </Headline>
            <FlatList 
                data={clientes}
                renderItem = { ({item})=> (
                    <List.Item
                        title={item.nombre}
                        description={item.empresa}
                        onPress={ ()=> navigation.navigate('DetallesCliente', {item, guardarConsultarApi}) }
                    />
                ) }
                keyExtractor={ cliente => (cliente.id).toString()}
            />

            <FAB
                icon="plus"
                style={GlobalStyle.fab}
                onPress={ ()=> navigation.navigate("NuevoCliente", {guardarConsultarApi}) }
            />
        </View>
    )
}

export default Inicio
