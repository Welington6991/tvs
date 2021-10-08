import React, { memo, useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    Dimensions,
    Alert,
    ActivityIndicator
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import AwesomeAlert from 'react-native-awesome-alerts';

import axios from 'react-native-axios'

const Login = ({ navigation }) => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [loadingView, setLoadingView] = useState(false)

    useEffect(() => {
        logged()
    }, [])

    const logged = async () => {
        var value = await AsyncStorage.getItem('login')
        if (value) {
            navigation.navigate('Apps')
        } else {
            setLoadingView(true)
        }
    }

    const login = async () => {
        setLoading(true)
        let userLogin = user
        let passwordLogin = password
        if (userLogin && passwordLogin) {
            axios.get(`https://angels.red/player_api.php?username=${userLogin}&password=${passwordLogin}`)
                .then(async (response) => {
                    await AsyncStorage.setItem('login', JSON.stringify(response.data));
                    setLoading(false)
                    navigation.navigate('Apps');
                }).catch((err) => {
                    axios.get(`http://api.gestor.tv:2082/api-extern.php?action=authP2P&name=${userLogin}&pass=${passwordLogin}`)
                        .then(async (response2) => {
                            if (response2.data) {
                                await AsyncStorage.setItem('login', JSON.stringify(response2.data));
                                setLoading(false)
                                navigation.navigate('Apps');
                            } else {
                                setMessage("Usuário ou senha incorretos")
                                setLoading(false)
                                show()
                            }
                        }).catch((err2) => {
                            setMessage("Usuário ou senha incorretos")
                            setLoading(false)
                            show()
                        })
                })
        } else {
            setMessage("Usuário ou senha não preenchidos")
            setLoading(false)
            show()
        }
    };

    const show = () => {
        setShowAlert(true)
    };

    const hide = () => {
        setShowAlert(false)
    };

    if (loadingView) {
        return (
            <View style={styles.container}>
                <View style={styles.boxLogin}>
                    <Image style={styles.image} source={require("../assets/logo.png")} />

                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ width: Platform.isTV ? "70%" : '80%', color: '#000000' }}>Usuário:</Text>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Usuário"
                            placeholderTextColor="#000000"
                            onChangeText={(user) => setUser(user)}
                        />

                        <Text style={{ width: Platform.isTV ? "70%" : '80%', color: '#000000' }}>Senha:</Text>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Senha"
                            placeholderTextColor="#000000"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />

                        <TouchableOpacity style={styles.loginBtn} onPress={() => { login() }}>
                            {loading ? <ActivityIndicator size={30} color='#FFFFFF' /> :
                                <Text style={styles.loginText}>Entrar</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Login"
                    message={message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText=""
                    confirmText="Tente novamente"
                    confirmButtonColor="#ED3833"
                    onCancelPressed={() => {
                        hide();
                    }}
                    onConfirmPressed={() => {
                        hide();
                    }}
                />
            </View>
        );
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    boxLogin: {
        flex: 0.8,
        width: Platform.isTV ? '50%' : '100%',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: Platform.isTV ? 'row' : 'column'
    },
    image: {
        width: '100%',
        height: Platform.isTV ? Dimensions.get('window').height : '45%',
        resizeMode: 'contain'
    },

    TextInput: {
        color: '#000000',
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        width: Platform.isTV ? "70%" : '80%',
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        paddingLeft: 30,
        paddingRight: 30,
        shadowColor: "rgba(0,0,0,.8)",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowRadius: 4.65,
        elevation: 15
    },

    loginBtn: {
        width: "50%",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#6333AF",
    },
    loginText: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
});

export default memo(Login);