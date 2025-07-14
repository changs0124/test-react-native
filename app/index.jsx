import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { instance } from "../apis/instance";

function index() {
    const [userCode, setUserCode] = useState(null);
    const [checkedState, setCheckedState] = useState(false);

    useEffect(() => {
        const fetchUserCode = async () => {
            const code = await AsyncStorage.getItem('userCode');
            setUserCode(code);
            setCheckedState(true);
        };

        fetchUserCode();
    }, []);

    const auth = useQuery({
        queryKey: ['auth', userCode],
        queryFn: async () => await instance.get(`/user/location/${userCode}`),
        enabled: !!userCode,
        retry: 0,
        refetchOnWindowFocus: false,
    })

    if (!checkedState || (userCode && auth.isLoading)) {
        return null;
    }

    if (!userCode || !!auth.data?.data === false) {
        return <Redirect href="/register" />;
    }

    return (
        <Redirect href={"/(tabs)"} />
    );
}

export default index;