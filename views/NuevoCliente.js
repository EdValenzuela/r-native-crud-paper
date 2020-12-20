import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { TextInput, Headline, Button, Paragraph ,Portal, Dialog } from 'react-native-paper';
import GlobalStyle from '../styles/global';
import axios from 'axios';

const NuevoCliente = ({navigation, route}) => {

    const { guardarConsultarApi } = route.params;

    const [nombre, guardarNombre] = useState('');
    const [telefono, guardarTelefono] = useState('');
    const [correo, guardarCorreo] = useState('');
    const [empresa, guardarEmpresa] = useState('');
    const [alert, guardarAlerta] = useState(false);

    //detectar si estamos editando o no

    useEffect(() => {
        if(route.params.cliente){
            const {nombre, telefono, correo, empresa} = route.params.cliente;

            guardarNombre(nombre);
            guardarTelefono(telefono);
            guardarCorreo(correo);
            guardarEmpresa(empresa);
        }
    }, [])

    const guardarCliente = async() =>{
        //validar
        if(nombre === '' || telefono === '' || correo === '' || empresa === ''){
            guardarAlerta(true);
            return;
        }

        //generar el cliente
        const cliente = {
            nombre,
            telefono,
            empresa,
            correo
        }

        

        if(route.params.cliente){

            const {id}=route.params.cliente;
            cliente.id = id;
            const url = `http://10.0.2.2:3000/clientes/${id}`;

            try {
                await axios.put(url, cliente);
            } catch (error) {
                console.log(error);
            }

        }else{
            //guardar el cliente en el api
            try {
                if(Platform.OS === 'ios'){
                    await axios.post('http://localhost:3000/clientes', cliente);
                }
                else{
                    await axios.post('http://10.0.2.2:3000/clientes', cliente);
                }
            } catch (error) {
                console.log(error)
            }
        }

        //redireccionar
        navigation.navigate('Inicio');

        //Limpiar el form (opcional)
        guardarNombre('');
        guardarTelefono('');
        guardarCorreo('');
        guardarEmpresa('');

        //cambiar a true para traernos el nuevo cliente
        guardarConsultarApi(true);
    }

    return (
        <View style={GlobalStyle.contenedor}> 
            <Headline style={GlobalStyle.titulo}>{route.params.cliente ? 'Editar nuevo cliente' : 'Añadir nuevo cliente'}</Headline>
            <TextInput
                label="Nombre"
                placeholder="Juanito"
                onChangeText={ texto => guardarNombre(texto) }
                value={nombre}
                style={styles.input}
            />
            <TextInput
                label="Teléfono"
                placeholder="964818866"
                onChangeText={ texto => guardarTelefono(texto) }
                value={telefono}
                style={styles.input}
            />
            <TextInput
                label="Correo"
                placeholder="correo@correo.com"
                onChangeText={ texto => guardarCorreo(texto) }
                value={correo}
                style={styles.input}
            />
            <TextInput
                label="Empresa"
                placeholder="nombre empresa"
                onChangeText={ texto => guardarEmpresa(texto) }
                value={empresa}
                style={styles.input}
            />

            <Button icon="pencil-circle" mode="contained" 
                onPress={ () => guardarCliente() }
                >
                Guardar Cliente
            </Button>

            <Portal>
                <Dialog 
                    visible={alert}
                    onDismiss={ ()=> guardarAlerta(false) }
                >
                    <Dialog.Title>
                        Error
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Todos los campos son obligatorios</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={ ()=>guardarAlerta(false)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>


        </View>
    )
}

const styles = StyleSheet.create({
    input:{
        marginBottom:20,
        backgroundColor: 'transparent'
    }
})

export default NuevoCliente
