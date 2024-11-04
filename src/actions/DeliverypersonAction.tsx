import {
    REGISTER_DELIVERY_PERSON_REQUEST,
    REGISTER_DELIVERY_PERSON_SUCCESS,
    REGISTER_DELIVERY_PERSON_FAIL
} from '../constants/adminConstants'; 
import { Dispatch } from 'redux';
import { AnyAction } from 'redux';
import axios, { AxiosError } from 'axios';
import api from '../Api'


export const registerDeliveryPerson = (userData: FormData) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        dispatch({ type: REGISTER_DELIVERY_PERSON_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };

       
        
        const { data } = await api.post("/api/admin/deliverypersonsignup", userData, config);

        dispatch({
            type: REGISTER_DELIVERY_PERSON_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            dispatch({
                type: REGISTER_DELIVERY_PERSON_FAIL,
                payload: error.response?.data.message || 'An error occurred',
            });
        } else {
            dispatch({
                type: REGISTER_DELIVERY_PERSON_FAIL,
                payload: 'An unknown error occurred',
            });
        }
    }
};