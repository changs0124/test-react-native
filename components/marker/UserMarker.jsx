import { StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

function UserMarker({ user }) {
    const styles = StyleSheet.create({
        layout: {
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            width: 250,
            backgroundColor: '#ffffff',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 4
        },
        container: {
            flexDirection: 'row',
            borderBottomColor: '#eeeeee',
            borderBottomWidth: 1,
            paddingVertical: 6,
        },
        lastContainer: {
            flexDirection: 'row',
            borderBottomColor: '#eeeeee',
            paddingVertical: 6,
        },
        label: {
            width: '40%',
            color: '#333333',
            textAlign: 'center'
        },
        bar: {
            width: '5%',
            color: '#aaaaaa',
            textAlign: 'center'
        },
        value: {
            width: '55%',
            color: '#000000',
            textAlign: 'center'
        }
    })

    return (
        <Marker
            coordinate={{
                latitude: user?.latitude,
                longitude: user?.longitude
            }}
            pinColor={!!user?.status ? 'green' : 'gray'}
        >
            <Callout tooltip>
                <View style={styles.layout}>
                        <View style={styles.container}>
                            <Text style={styles.label}>이름</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{user?.userName}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>장치</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{user?.deviceNumber}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>최대 적재율</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{Number(user?.deviceMaxVolume).toFixed(2)}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>목적지</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{!!user?.status ? user?.cargoName : '현재 목적지 없음'}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>제품</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{!!user?.status ? user?.productName : '현재 화물 없음'}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>수량</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{!!user?.status ? user?.productCount : ''}</Text>
                        </View>
                        <View style={styles.lastContainer}>
                            <Text style={styles.label}>적재율</Text>
                            <Text style={styles.bar}>|</Text>
                            <Text style={styles.value}>{!!user?.status ? Number((user?.productVolume * user?.productCount / user?.deviceMaxVolume * 100)).toFixed(2) + "%" : "0.00%"}</Text>
                        </View>
                </View>
            </Callout>
        </Marker >
    );
}

export default UserMarker;