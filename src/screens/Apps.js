import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    Platform,
    ScrollView,
    ActivityIndicator
} from "react-native";

import AwesomeAlert from 'react-native-awesome-alerts';

import RNDM from 'fsc-react-native-easy-downloader';
import FileViewer from 'react-native-file-viewer';
var SendIntentAndroid = require("react-native-send-intent");

var objLoading = {}

export default function Apps() {
    const [data, setData] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState({})
    const [showProgress, setShowProgress] = useState(false)

    useEffect(() => {
        getApps();
    }, [])

    const getApps = async () => {
        const response = await fetch(`https://app-33161.nuvem-us-02.absamcloud.com`);
        let apps = await response.json();
        apps.map((r, i) => {
            apps[i].loading = false
        })

        setData(apps)
    };

    const show = () => {
        setShowAlert(true)
    };

    const hide = () => {
        setShowAlert(false)
    };

    const instalar = async (url, name, index) => {
        setShowProgress(true)
        setMessage('Instalando app')
        show()

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        SendIntentAndroid.isAppInstalled("com.artstudio.tvsorigem").then(isInstalled => {
            if (isInstalled) {
                setShowProgress(false)
                setMessage('App já instalado em seu dispositivo.')
                show()
                loading['loading' + index] = false
            } else {
                RNDM.download({
                    url: url,
                    autoInstall: true,
                    savePath: RNDM.DirDownload + '/' + name + '.apk',
                    title: name,
                    description: '',
                }).then((ret) => {
                    FileViewer.open(RNDM.DirDownload + '/' + name + '.apk')
                        .then(() => {
                            setShowProgress(false)
                            setMessage('App instalado com sucesso')
                            show()
                            loading['loading' + index] = false
                        })
                        .catch(error => {
                            setShowProgress(false)
                            setMessage('App não pode ser instalado em seu dispositivo.')
                            show()
                            loading['loading' + index] = false
                        });
                }).catch((err) => {
                    setShowProgress(false)
                    setMessage('Download do App não pode ser concluído.')
                    show()
                    loading['loading' + index] = false
                }
                )
            }
        });
    }

    if (data) {
        return (
            <View style={styles.container}>
                <View style={styles.viewTitle}>
                    <Text style={styles.title}>Loja de Aplicativos</Text>
                </View>
                <ScrollView style={styles.scroll}>
                    <View style={styles.viewApps}>
                        {data.map((result, index) => {
                            return (
                                <View key={index} style={styles.viewApp}>
                                    <View style={styles.app}>
                                        <Image source={{ uri: result.icon }} style={styles.imageApp} />
                                        <Text style={styles.textApp}>{result.name}</Text>
                                        <TouchableOpacity style={styles.buttonApp} onPress={() => { instalar(result.source, result.name, index) }}>
                                            <Text style={styles.textButtonApp}>Instalar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                        }
                    </View>
                </ScrollView>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={showProgress}
                    title="Instalar App"
                    message={message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={!showProgress}
                    cancelText=""
                    confirmText="Ok"
                    confirmButtonColor="#ED3833"
                    onCancelPressed={() => {
                        hide();
                    }}
                    onConfirmPressed={() => {
                        hide();
                    }}
                    closeOnTouchOutside={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    viewTitle: {
        flex: 0.05,
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10
    },
    title: {
        color: '#000000',
        fontWeight: 'bold'
    },
    scroll: {
        flex: 0.95,
        width: '100%'
    },
    viewApps: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewApp: {
        marginBottom: 10,
        padding: 10,
        width: Platform.isTV ? '25%' : '90%'
    },
    app: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        shadowColor: "rgba(0,0,0,.4)",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowRadius: 4.65,
        elevation: 15
    },
    imageApp: {
        width: '100%',
        height: 100,
        resizeMode: 'cover'
    },
    textApp: {
        color: '#000000',
        padding: 10
    },
    buttonApp: {
        width: '50%',
        height: 30,
        backgroundColor: '#6333AF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    textButtonApp: {
        color: '#FFFFFF'
    }
});