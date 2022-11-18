import React, {useState} from "react";
import { StyleSheet } from "react-native";
import { 
    Container, 
    Text,
    Button,
    H2,
    Content,
    List,
    ListItem,
    Left,
    Right 
} from "native-base";
import globalStyles from "../Styles/global";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`

const Proyectos = () => {

    const navigation = useNavigation()

    // Apollo
    const { data, loading, error } = useQuery(OBTENER_PROYECTOS)
    
    return (
        <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
            <Button
                style = {[globalStyles.boton, {marginTop: 30, marginHorizontal: 5}]}
                block
                onPress={() => navigation.navigate('NuevoProyecto')}
            >
                <Text style={globalStyles.botonTexto}>Nuevo Proyecto</Text>
            </Button>

            <H2 style = {globalStyles.subtitulo}>Selecciona un Proyecto</H2>

            <Content>
                <List style = {styles.contenido}>
                    
                    {
                        // Waiting for data to charged 
                        (!loading && data)? data.obtenerProyectos.map(proyecto=>(
                            <ListItem
                                key = {proyecto.id}
                                onPress={()=>navigation.navigate("Proyecto", proyecto)}
                            >
                                <Left>
                                    <Text>{proyecto.nombre}</Text>    
                                </Left>
            
                                <Right>
                                    
                                </Right>
                            </ListItem>
                        )): <Text>Cargando</Text>
                   }
                </List>
            </Content>

        </Container>
        
    )
    
}
const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'        
    }
})

export default Proyectos