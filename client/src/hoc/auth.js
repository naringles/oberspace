import axios from 'axios'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { auth } from '../_actions/user_action'


export default function (SpecificComponent, option, adminRoute = null){

    console.log("실행됨1")
    // null 아무나 출입이 가능한 페이지
    // true 로그인한 유저만 출입 가능한 페이지
    // false  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props){
        console.log("실행됨2")
        let navigate = useNavigate();
        const dispatch = useDispatch();
        useEffect(()=>{
            dispatch(auth())
            .then(response =>{
                console.log(response);

                if(!response.payload.isAuth){
                    if(option){
                        navigate('/login')
                    }
                }
                else{
                    if(adminRoute && !response.payload.isAdmin){
                        navigate('/')
                    }
                    else{
                        if(option === false){
                            navigate('/');
                        }
                    }
                }
            })
        }, [])
        return(
            <SpecificComponent/>
        )
    }

    return <AuthenticationCheck/>
}