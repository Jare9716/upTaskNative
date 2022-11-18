import { ApolloClient } from "@apollo/client"; 
import { InMemoryCache } from "@apollo/client"
import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context"

import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const httpLink = createHttpLink({

    uri: Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://192.168.1.6:4000/'
})

const authLink = setContext( async (_,{headers})=>{
    // Leer el token
    const token = await AsyncStorage.getItem('token')

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}`:''
        }
    }
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink ),
    connectToDevTools: true
})

export default client 