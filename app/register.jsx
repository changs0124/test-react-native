import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { TextInput } from "react-native-gesture-handler";
import uuid from 'react-native-uuid';
import { instance } from "../apis/instance";

function register() {
    const [isOpen, setIsOpen] = useState(false);
    const [init, setInit] = useState(false);

    const [userName, setUserName] = useState("");
    const [deviceId, setDeviceId] = useState(0);
    const [tempDevices, setTempDevices] = useState([]);

    const devices = useQuery({
        queryKey: ['devices'],
        queryFn: async () => instance.get('/devices').then(res => res.data),
        enabled: true,
        retry: 0,
        refetchOnWindowFocus: false,
    })

    const register = useMutation({
        mutationFn: async ({ userName, deviceId }) => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') throw new Error('위치 권한이 거부되었습니다.');

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const userCode = uuid.v4();

            const res = await instance.post('/user', {
                userCode,
                userName,
                deviceId,
                latitude,
                longitude
            })

            return userCode
        },
        onSuccess: async (userCode) => {
            await AsyncStorage.setItem('userCode', userCode.toString());
            Alert.alert('등록 완료', '장치가 등록되었습니다.');
            router.replace('/')
        },
        onError: (err) => {
            Alert.alert(err?.message)
        }
    })

    useEffect(() => {
        if (devices?.data?.length && !init) {
            setTempDevices(
                devices.data.map(device => ({
                    label: device.deviceNumber,
                    value: device.id,
                }))
            );
            setDeviceId(devices?.data?.[0]?.id);
            setInit(true);
        }
    }, [devices?.data, init])

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center', // 화면 중앙 정렬
            alignItems: 'center',
            backgroundColor: '#f2f2f2',
        },
        box: {
            width: '85%',
            padding: 20,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            backgroundColor: 'white',
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
        },
        label: {
            marginTop: 10,
            marginBottom: 4,
            fontSize: 14,
            fontWeight: '600',
        },
        pickerWrapper: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            overflow: 'hidden',
        },
        picker: {
            height: 44,
            width: '100%',
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 44,
            marginTop: 4,
        },
        button: {
            marginTop: 20,
        },
    })

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>장치 등록</Text>
                <View style={{ zIndex: 3000 }}>
                    <Text style={styles.label}>장치 시리얼 넘버</Text>
                    <DropDownPicker
                        open={isOpen}
                        value={deviceId}
                        items={tempDevices}
                        setOpen={setIsOpen}
                        setValue={setDeviceId}
                        setItems={setTempDevices}
                        style={{
                            backgroundColor: 'white',
                            borderColor: '#ccc'
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: 'white',
                            borderColor: '#ccc',
                        }}
                        textStyle={{
                            color: 'black',
                        }}
                    />
                </View>
                <View>
                    <Text style={styles.label}>장치 이름</Text>
                    <TextInput
                        value={userName}
                        onChangeText={setUserName}
                        placeholder="장치 이름을 입력하세요."
                        style={styles.input}
                    />
                </View>
                <View style={styles.button}>
                        <Button title="장치 등록" onPress={() => register.mutateAsync({ userName: userName, deviceId: deviceId}).catch(() => {})}/>
                </View>
            </View>
        </View>
    );
}

export default register;