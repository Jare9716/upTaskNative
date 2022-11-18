import React, {useState} from "react";
import { View } from "react-native";
import { 
    Container,
    Button,
    Text,
    H1,
    Input,
    Form,
    Item,
    Toast
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../Styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Apollo
import { gql, useMutation } from "@apollo/client";

const AUTENTICAR_USUARIO = gql `
    mutation autenticarUsuario ($input: AutenticarInput) {
        autenticarUsuario(input: $input){
        token
        }
    }
`

const Login = () => {

     // State del formulario
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState ('')

    const [mensaje, setMensaje] = useState(null)

    // React Navigation
    const navigation = useNavigation()

    
    // Mutation de Apollo
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO)

    // Button iniciar sesión
    const handleSubmit = async () =>{
        // Validar
        if(email === '' || password === ''){
            // Alerta
            setMensaje('Todos los campos son obligatorios')
            return
        }

        // Validar usuario
        try {
            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            })
            const { token } = data.autenticarUsuario
            
            // Token en storage
            await AsyncStorage.setItem('token', token)

            // Redireccionar a proyectos
            navigation.navigate('Proyectos')

        } catch (error) {
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
        <Container style = {[globalStyles.contenedor ,{backgroundColor: '#E84347'}]}>
            <View style = {globalStyles.contenido}>
                <H1 style = {globalStyles.titulo}>UpTask</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            keyboardType="email-address"
                            placeholder="Email"
                            onChangeText={texto => setEmail(texto.toLowerCase())}
                        />
                    </Item>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            secureTextEntry = {true}
                            placeholder="Password"
                            onChangeText={texto => setPassword(texto)}
                        />
                    </Item>
                </Form>

                <Button
                    block
                    style = {globalStyles.boton}
                    onPress = {()=> handleSubmit()}
                >
                    <Text 
                    style= {globalStyles.botonTexto}> Iniciar Sesión </Text>
                </Button>

                <Text 
                    style ={globalStyles.enlace}
                    onPress = {() => navigation.navigate('CrearCuenta')}
                > 
                    Crear Cuenta
                </Text>

                {mensaje && mostratAlerta()}
            </View>
        </Container>
    )
}

export default Login