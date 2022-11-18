import React, {useState} from "react";
import { Keyboard, View } from "react-native";
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

// Apollo
import { gql, useMutation } from "@apollo/client";

const NUEVA_CUENTA = gql `
    mutation crearUsuario($input: UsuarioInput) {
        crearUsuario(input:$input)
    }
`

const CrearCuenta = () => {

    // State del formulario
    const [nombre, setNombre] = useState ('')
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState ('')

    const [mensaje, setMensaje] = useState(null)

    // React Navigation
    const navigation = useNavigation()

    // Mutation de Apollo
    const [ crearUsuario ] = useMutation(NUEVA_CUENTA)

    // Funcion crear cuenta
    const handleSUbmit = async () =>{
        // Validar
        if(nombre === '' || email === '' || password === ''){
            // Alerta
            setMensaje('Todos los campos son obligatorios')
            return
        }

        // Password 6 caracteres
        if(password.length < 6){
            setMensaje('La contraseña debe tener al menos 6 caracteres')
            return
        }

        // Guardar usuario
        try {
            const { data } = await crearUsuario({
                variables: {
                    input: {
                        nombre,
                        email,
                        password
                    }
                }
            })
            
            setMensaje(data.crearUsuario)
            //Hide keyboard
            Keyboard.dismiss()
            // Wait 15ms to login's navigation
            setTimeout(() => {
                navigation.navigate('Login')
            }, 15);
            

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
                                placeholder="Nombre"
                                onChangeText={texto => setNombre(texto)}
                            />
                        </Item>

                        <Item inlineLabel last style={globalStyles.input}>
                            <Input
                                keyboardType="email-address"
                                placeholder="Email"
                                onChangeText={texto => setEmail(texto)}
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
                        onPress = {() => handleSUbmit()}
                    >
                        <Text 
                        style= {globalStyles.botonTexto}> Crear Cuenta </Text>
                    </Button>
                    {mensaje && mostratAlerta()}
                </View>
            </Container>
    )
}

export default CrearCuenta