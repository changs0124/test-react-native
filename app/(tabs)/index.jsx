import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import { instance } from '../../apis/instance';
import CargoMarker from '../../components/marker/CargoMarker';
import UserMarker from '../../components/marker/UserMarker';

function index() {
    const ref = useRef(null);
    const mapRef = useRef(null);

    const snapPoints = useMemo(() => ['5%', '50%'], []);

    const [userCode, setUserCode] = useState(null);

    const [location, setLocation] = useState(null);

    const [isTracking, setIsTracking] = useState(false);

    const [isCargosOpen, setIsCargosOpen] = useState(false);
    const [cargoId, setCargoId] = useState(0);
    const [tempCargos, setTempCargos] = useState([]);

    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [productId, setProductId] = useState(0);
    const [productCount, setProductCount] = useState(1);
    const [selection, setSelection] = useState({ start: 1, end: 1 });
    const [tempProducts, setTempProducts] = useState([]);

    const [delId, setDelId] = useState(0);

    const [trackingPath, setTrackingPath] = useState([]);

    const user = useQuery({
        queryKey: ['user'],
        queryFn: async () => await instance.get(`/user/location/${userCode}`).then(res => res.data),
        enabled: !!userCode,
        retry: 0,
        refetchOnWindowFocus: false,
    })

    const cargos = useQuery({
        queryKey: ["cargos"],
        queryFn: () => instance.get("/cargos").then(res => res.data),
        enabled: !!userCode,
        refetchOnWindowFocus: false,
        retry: 0
    })

    const products = useQuery({
        queryKey: ["products"],
        queryFn: () => instance.get("/products").then(res => res.data),
        enabled: !!userCode,
        refetchOnWindowFocus: false,
        retry: 0
    })

    const userLocations = useQuery({
        queryKey: ["userLocations"],
        queryFn: () => instance.get(`/user/locations/${userCode}`).then(res => res.data),
        enabled: !!userCode,
        refetchInterval: 5000,
        refetchOnWindowFocus: false,
        retry: 0
    })

    const updateLocation = useMutation({
        mutationFn: ({ latitude, longitude }) =>
            instance.put('/user/location', { userCode, latitude, longitude }),
        onError: (error) => {
            Alert.alert(error?.response?.data?.message);
        }
    })

    const startDelivery = useMutation({
        mutationFn: () => instance.post('/delivery', { userCode, cargoId, productId, productCount }),
        onSuccess: (res) => {
            setDelId(res?.data)
            Alert.alert("배송 시작")
            setIsTracking(true);
            user.refetch()
        },
        onError: (error) => {
            Alert.alert(error?.response?.data?.message);
        }
    })

    const finishDelivery = useMutation({
        mutationFn: () => {
            const trackingPathStr = JSON.stringify(trackingPath);
            return instance.put("/delivery", { delId, trackingPath: trackingPathStr })
        },
        onSuccess: () => {
            Alert.alert("배송 종료")
            setIsTracking(false)
            user.refetch()
        },
        onError: (error) => {
            Alert.alert(error?.response?.data?.message);
        }
    })

    useEffect(() => {
        const fetchUserCode = async () => {
            const code = await AsyncStorage.getItem('userCode');
            setUserCode(code);
            setCheckedState(true);
        };

        fetchUserCode();
    }, []);

    useEffect(() => {
        if (!location || !userCode) return;

        updateLocation.mutate({
            userCode: userCode,
            latitude: location.latitude,
            longitude: location.longitude,
        });

        if (isTracking) {
            setTrackingPath(prev => [
                ...prev,
                { latitude: location.latitude, longitude: location.longitude }
            ]);
        }
    }, [location])

    useEffect(() => {
        if (cargos?.data?.length) {
            setTempCargos(
                cargos.data.map(cargo => ({
                    label: cargo.cargoName,
                    value: cargo.id,
                }))
            );

            setCargoId(cargos?.data?.[0]?.id)
        }
    }, [cargos?.data])

    useEffect(() => {
        if (products?.data?.length) {
            setTempProducts(
                products?.data.map(product => ({
                    label: product.productName,
                    value: product.id,
                    volume: product.volume
                }))
            );

            setProductId(products?.data?.[0]?.id)
        }
    }, [products?.data])

    useEffect(() => {
        let tempLocation;

        const startWatching = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('위치 권한이 거부되었습니다');
                return;
            }

            tempLocation = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,       // 5초 간격으로 갱신
                    distanceInterval: 10,     // 5m 이상 이동 시 갱신
                },
                (loca) => {
                    const { latitude, longitude } = loca.coords;

                    setLocation({
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        };

        startWatching();

        return () => {
            if (tempLocation) {
                tempLocation.remove();
            }
        };
    }, []);

    const handleProductCountOnChange = (data) => {
        const count = Number(data);

        if (isNaN(count)) return;

        const product = tempProducts.find(p => p.value === productId);
        const productVolume = product?.volume;
        const maxVolume = user?.data?.deviceMaxVolume;

        const maxCount = Math.floor(maxVolume / productVolume);

        if (productVolume * count > maxVolume) {
            Alert.alert(
                '적재량 초과',
                `최대 적재량을 초과했습니다.\n최대 ${maxCount}개까지 가능합니다.`
            );

            const value = String(maxCount);
            setProductCount(value);
            setSelection({ start: value.length, end: value.length }); // 👈 커서 맨 뒤로
        } else {
            const value = count < 1 ? '1' : String(count);
            setProductCount(value);
            setSelection({ start: value.length, end: value.length }); // 👈 커서 맨 뒤로
        }
    };

    const handleStartDeliveryOnPress = async () => {
        setIsCargosOpen(false)
        setIsProductsOpen(false)
        await startDelivery.mutateAsync({ productCount: Number(productCount) }).catch(() => { })
    }

    const handleFinishDeliveryOnPress = async () => {
        await finishDelivery.mutateAsync().catch(() => { })
    }

    const styles = StyleSheet.create({
        sheetContainer: {
            padding: 20,
            backgroundColor: 'white',
        },
        label: {
            fontWeight: 'bold',
            fontSize: 14,
            marginBottom: 6,
            color: '#333',
        },
        dropdown: {
            backgroundColor: 'white',
            borderColor: '#ccc',
            zIndex: 1,
        },
        dropdownContainer: {
            backgroundColor: 'white',
            borderColor: '#ccc',
            zIndex: 1000,
        },
        dropdownText: {
            color: 'black',
        },
        input: {
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: 'white',
            color: '#000000',
            fontSize: 14,
            textAlign: 'right'
        },
        button: {
            backgroundColor: '#1E90FF',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            elevation: 2,
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
        },
        locateButton: {
            position: 'absolute',
            top: 55,
            right: 10,
            backgroundColor: 'tomato',
            padding: 12,
            borderRadius: 30,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 3,
            zIndex: 999,
        },
    });

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.locateButton} onPress={() => {
                        if (mapRef.current && location) {
                            mapRef.current.animateToRegion(location, 800);
                        }
                    }}>
                        <Ionicons name="locate" size={24} color="white" />
                    </TouchableOpacity>
                    <MapView
                        ref={mapRef}
                        style={StyleSheet.absoluteFillObject}
                        region={location}
                        showsUserLocation={true}
                    >
                        {cargos?.data?.map(cargo => (
                            <CargoMarker key={cargo?.id} cargo={cargo} />
                        ))}
                        {userLocations?.data?.map(user => (
                            <UserMarker key={user?.id} user={user} />
                        ))}
                    </MapView>

                    <BottomSheet
                        ref={ref}
                        index={1}
                        snapPoints={snapPoints}
                        enablePanDownToClose={false}
                        enableContentPanningGesture={true}
                        keyboardBehavior="interactive"
                        keyboardBlurBehavior="restore"
                    >
                        <BottomSheetView
                            contentContainerStyle={{ paddingBottom: 40 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.sheetContainer}>
                                <View style={{ zIndex: 3000, marginBottom: 16 }}>
                                    <Text style={styles.label}>도착지</Text>
                                    <DropDownPicker
                                        open={isCargosOpen}
                                        value={cargoId}
                                        items={tempCargos}
                                        setOpen={setIsCargosOpen}
                                        setValue={setCargoId}
                                        setItems={setTempCargos}
                                        disabled={isTracking}
                                        style={styles.dropdown}
                                        dropDownContainerStyle={styles.dropdownContainer}
                                        textStyle={styles.dropdownText}
                                    />
                                </View>
                                <View style={{ zIndex: 2000, marginBottom: 16 }}>
                                    <Text style={styles.label}>제품</Text>
                                    <DropDownPicker
                                        open={isProductsOpen}
                                        value={productId}
                                        items={tempProducts}
                                        setOpen={setIsProductsOpen}
                                        setValue={setProductId}
                                        setItems={setTempProducts}
                                        disabled={isTracking}
                                        style={styles.dropdown}
                                        dropDownContainerStyle={styles.dropdownContainer}
                                        textStyle={styles.dropdownText}
                                    />
                                </View>
                                <View style={{ marginBottom: 24 }}>
                                    <Text style={styles.label}>수량</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={String(productCount)}
                                        onChangeText={handleProductCountOnChange}
                                        onFocus={() => {
                                            const len = productCount.length;
                                            setSelection({ start: len, end: len });
                                        }}
                                        selection={selection}
                                        placeholder="수량을 입력하세요"
                                        editable={!isTracking}
                                    />
                                </View>
                                {isTracking ? (
                                    <TouchableOpacity style={styles.button} onPress={handleFinishDeliveryOnPress}>
                                        <Text style={styles.buttonText}>도착</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.button} onPress={handleStartDeliveryOnPress}>
                                        <Text style={styles.buttonText}>출발</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default index;