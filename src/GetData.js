import React, { useEffect } from 'react';
import clientCreds from './apikey.js';

const GetData = ()=>{

useEffect(()=>{

    const apiCtrler = (function (){


        const clientId = clientCreds[0];
        const clientSecret = clientCreds[1];
        //private function to get token id
        const _getToken =  async function (){
        
            let result = await fetch(encodeURI("https://accounts.spotify.com/api/token"),{
                                    method: "POST",
                                    headers:{
                                    'Content-Type' : 'application/x-www-form-urlencoded', 
                                    'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
                                    },
                                    body:"grant_type=client_credentials"
                                });
            const data = await result.json();
            return data.access_token;
        }
        //private function to get list of genres
        const _getGenres = async (token) => {

            const result = await fetch(`https://api.spotify.com/v1/browse/categories?country=US&locale=en_US&limit=10&offset=5`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });

            const data = await result.json();
            return data.categories.items;
        }
        //returning object with getToken and getGenres as its methods
        return {
            getToken(){
                return _getToken();
            },
            getGenres(token){
                return _getGenres(token);
            }
        }
    })();
    //end apiCtrler
    //AppCtrler function to fetch data using apiCtrler function
    const APPCtrler = (function(APICtrl) {
        //loadGenres function to call the apiCtrler methods
        const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();
        //get the genres
        console.log(token);
        const genres = await APICtrl.getGenres(token);
        console.log(genres);
        }

        return {
            init() {
                console.log('App is starting');
                loadGenres();
            }
        }
    })(apiCtrler);
    //call the loadgenres method
    APPCtrler.init();
},[]);

    return(
        <div>
            
        </div>
    )
}

export default GetData;


