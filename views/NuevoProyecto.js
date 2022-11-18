import React, {useState} from "react";
import { View } from "react-native";
import { Container, Button, Text, H1, Form, Item, Input, Toast } from 'native-base'
import globalStyles from "../Styles/global";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto($input: ProyectoInput){
        nuevoProyecto(input : $input){
            nombre
            id
        }
    }
`
// Actualizar cache
const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`


const NuevoProyecto = () =>{
    
    // Navigation
    const navigation = useNavigation()

    // state del componenete 
    const [nombre, setNombre] = useState('')
    const [mensaje, setMensaje] = useState(null)

    // Apollo
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: { nuevoProyecto}}){
            const { obtenerProyectos } = cache.readQuery({query: OBTENER_PROYECTOS})
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])}
            })
        }
    })

    // Boton Crear Proyecto
    const handleSubmit = async ()=>{
        // Valid name
        if(nombre === ''){
            setMensaje('El nombre del Proyecto es Obligatorio')
            return
        }

        // Save proyect
        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            })
            //console.log(data)
            setMensaje('Proyecto Creado Correctamente')
            navigation.navigate('Proyectos')


        } catch (error) {
            //console.log(error)
            setMensaje(error.message)
        }
    }

    // muestra un mensaje toast
    const mostratAlerta  = () =>{
        Toast.show({
            text: mensaje,
            buttonText: 'Ok',
            duration: 1500 
        })
    }

    return(

        <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
            <View style = {globalStyles.contenido}>
                <H1 style = {globalStyles.subtitulo}>Nuevo Proyecto</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            placeholder="Nombre Del Proyecto"
                            onChangeText={ texto=>setNombre(texto) } 
                        />
                    </Item>
                </Form>

                <Button
                style = {[globalStyles.boton, {marginTop: 30}]}
                block
                onPress={()=> handleSubmit()}
                >
                    <Text style={globalStyles.botonTexto}>Crear Proyecto</Text>
                </Button>

                {mensaje && mostratAlerta()}
            </View>

        </Container>

    )
}

export default NuevoProyecto