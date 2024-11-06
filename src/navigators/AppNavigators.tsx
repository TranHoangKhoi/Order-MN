import React, { useEffect, useState, useCallback } from 'react';
import { RootNavigators } from './RootNavigators';
import { AuthNavigator } from './AuthNavigators';
import { LoadingLottie } from '~/components';
import { TAuth, TError } from '~/types';
import { RootState, useAppSelector, useAppDispatch, setLogin, setProvinces } from '~/store';
import { _func, LocalStorage } from '~/utils';
import { authAPI } from '~/api';
import { setToken } from '~/api/instance';

export const AppNavigator = () => {
    const { isLogin }: TAuth = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const [mainLoading, setMainLoading] = useState(true);

    const getProvinces = useCallback(async () => {
        try {
            const res = await authAPI.provinces();
            dispatch(setProvinces(res.data));
        } catch (error) {
            _func.handleError(error as TError, dispatch);
        }
    }, [dispatch]);

    const login = useCallback(async () => {
        setMainLoading(true);
        const response = await LocalStorage.getUser();
        const responseToken = await LocalStorage.getToken();
        // console.log("token : ", responseToken);
        setToken(responseToken)
        dispatch(setLogin(!!response));
        await getProvinces();
        setMainLoading(false);
    }, [dispatch, getProvinces]);

    useEffect(() => {
        login();
    }, [login]);

    if (mainLoading) {
        return <LoadingLottie />;
    }

    return isLogin ? <RootNavigators /> : <AuthNavigator />;
};
