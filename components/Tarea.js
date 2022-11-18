import React from "react";
import { 
    Container,
    Text,
    ListItem,
    Left,
    Right,
    Icon,
    Toast,
} from "native-base";
import { StyleSheet, Alert } from "react-native";
import { gql, useMutation } from "@apollo/client";

const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean){
        actualizarTarea(id: $id, input: $input, estado: $estado){
            nombre
            id
            proyecto
            estado
        }
    }
`
const ELIMINAR_TAREA = gql`
    mutation eliminarTarea($id: ID!){
        eliminarTarea(id: $id)
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

const Tarea = ({tarea, proyectoID}) => {

    // Aollo
    const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA)
    // Obtener y acualizar el cahce de tareas para no cargar los datos directamente de el DB (optimizar recursos)
    const [eliminarTarea] = useMutation(ELIMINAR_TAREA,{
        update(cache){ //Obtener Tareas
            const{obtenerTareas}=cache.readQuery({
                query: OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto: proyectoID
                    }
                }
            })

            cache.writeQuery({ //Actualizar el chache de tareas
                query: OBTENER_TAREAS,
                variables:{
                    input:{
                        proyecto: proyectoID
                    }
                },
                data:{
                    obtenerTareas: obtenerTareas.filter(tareaActual=> tareaActual.id !== tarea.id)
                }
            })
        }
    })

    // Cambia el estado de una tarea a completo o incompleto
    const cambiarEstado = async () =>{
        // obtener el ID de tarea
        const { id } = tarea
        console.log(!tarea.estado)

        try {
            const {data} = await actualizarTarea({
                variables: {
                    id, 
                    input: {
                        nombre: tarea.nombre
                    },
                    estado: !tarea.estado
                }
            })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    //Dialogo de eliminar o no una tarea
    const mostrarEliminar = () =>{
        Alert.alert('Eliminar Tarea', 'Deseas eliminar esta tarea?',[
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => eliminarTareaDB()
            }
        ])
    }

    //Eliminar Tarea en la base de datos
    const eliminarTareaDB = async () => {
        const { id } = tarea

        try {
            const {data} = await eliminarTarea({
                variables: {
                        id
                }
            })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <ListItem
                onPress={()=>cambiarEstado()}
                onLongPress={()=> mostrarEliminar()}
            >
                <Left>
                    <Text>{tarea.nombre}</Text>
                </Left>

                <Right>
                    {tarea.estado ? (
                        <Icon
                            style={[styles.icono, styles.completo]}
                            name='ios-checkmark-circle'
                        />
                    ):
                    (
                        <Icon
                        style={[styles.icono, styles.incompleto]}
                        name='ios-checkmark-circle'
                        />
                    )}
                </Right>
            </ListItem>
        </>
    )
}

const styles = StyleSheet.create({
    icono: {
        fontSize: 32,
    },
    completo: {
        color: 'green'
    },
    incompleto: {
        color: '#E1E1E1'
    },
})

export default Tarea