import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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