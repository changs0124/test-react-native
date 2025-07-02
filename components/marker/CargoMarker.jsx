import { StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

function CargoMarker({ cargo }) {

    const styles = StyleSheet.create({
        layout: {
            flexDirection: 'row',
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            width: 200,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 4
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
                latitude: cargo?.latitude,
                longitude: cargo?.longitude
            }}
            pinColor='black'
        >
            <Callout tooltip>
                <View style={styles.layout}>
                    <Text style={styles.label}>이름</Text>
                    <Text style={styles.bar}>|</Text>
                    <Text style={styles.value}>{cargo?.cargoName}</Text>
                </View>
            </Callout>
        </Marker>
    );
}

export default CargoMarker;