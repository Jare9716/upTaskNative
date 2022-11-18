import React, {useState} from "react";
import { 
    Container, 
    Button,
    Text,
    H2,
    Content,
    List,
    Form,
    Item,
    Input,
    Toast  
} from "native-base";
import globalStyles from "../Styles/global";
import {gql, useMutation, useQuery} from '@apollo/client'
import Tarea from "../components/Tarea";
import { StyleSheet } from "react-native";

// Crear nuevas tareas
const NUEVA_TAREA = gql`
    mutation nuevaTarea($input: TareaInput){
        nuevaTarea(input: $input){
            nombre
            id
            proyecto
            estado
        }
    }
`
// Consulta las tareas del proyecto
const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput){
        obtenerTareas(input: $input){
            id
            nombre
            estado
        }
    }
`
const Proyecto = ({route}) =>{
    //Obtiene el id del proyecto
    const { id } = route.params

    // State del componente
    const [nombre, setNombre] = useState('')
    const [mensaje, setMensaje] = useState(null)

    // Apollo obtener tareas
    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables:{
            input:{
                proyecto: id
            }
        }
    })
    console.log(data)

    // Apollo crear tareas y actualizarlas nuevamente no hacemos la consulta al server solo al cachce 
    const [nuevaTarea] = useMutation(NUEVA_TAREA,{
        update(cache, {data:{nuevaTarea}}){
            const{obtenerTareas} = cache.readQuery({
                query: OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto: id
                    }
                }
            })

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto: id
                    }
                },
                data: {
                    obtenerTareas: [...obtenerTareas,nuevaTarea]
                }
            })
        }
    })

    // Validar y crear tareas
    const handleSubmit = async () =>{
        if(nombre === ''){
            setMensaje('El nombre de la tarea es obligatorio')
            return
        }

        // almacenarlo en la base de datos
        try {
            const {data} = await nuevaTarea({
                variables: {
                    input: {
                        nombre,
                        proyecto: id
                    }
                }
            })
            setNombre('')
            setMensaje('La tarea se agrego con exito')
            setTimeout(() => {
                setMensaje(null)
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarAlerta = () =>{
        Toast.show({
            text: mensaje,
            buttonText: 'OK',
            duration: 5000
        })
    }

    //Si apollo esta consultando
    

    return(
        <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
            <Form style={{marginHorizontal: '2.5%', marginTop: 20}}>
                <Item inlineLabel last style={globalStyles.input}>
                    <Input
                        placeholder="Nombre Tarea"
                        value={nombre}
                        onChangeText={texto => setNombre(texto)}
                    />
                </Item>

                <Button
                    style = {globalStyles.boton}
                    block
                    onPress={()=> handleSubmit()}
                >
                    <Text>Crear Tarea</Text>
                </Button>
            </Form>

            <H2 style={globalStyles.subtitulo}>Tareas: {route.params.nombre}</H2>

            <Content>
                <List style = {styles.contenido}>
                    {
                        (data)?
                                data.obtenerTareas.map(tarea =>(
                                    <Tarea
                                        key={tarea.id}
                                        tarea={tarea}
                                        proyectoID={id}
                                    />
                                ))
                        :<Text>Cargando Tareas</Text>
                    }
                </List>
            </Content>

            {mensaje && mostrarAlerta()}
        </Container>
    )
}

const styles = StyleSheet.create({
    contenido:{
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'
    },

})

export default Proyecto