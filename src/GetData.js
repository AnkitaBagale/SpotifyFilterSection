import React, { useEffect, useState } from 'react';

const GetData = ()=>{

const [genresList, setGenresList] = useState([]);
// const [genresPlayList, setGenresPlayList] = useState([{id:"",name:""}]);

useEffect(()=>{

    const apiCtrler = (function (){

        const clientId = process.env.REACT_APP_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
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

            const result = await fetch(`https://api.spotify.com/v1/browse/categories?country=US&locale=en_US&limit=10`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });

            const data = await result.json();
            return data.categories.items;
        }
        //private function to get list of playlist of particular genre
        const _getPlaylistByGenre = async (token, genreId) => {

            const limit = 5;
            
            const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
    
            const data = await result.json();
            return data.playlists.items;
        }
        const _getTracks = async (token, tracksEndPoint) => {

            const limit = 5;
    
            const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
    
            const data = await result.json();
            return data.items;
        }
    
        const _getTrack = async (token, trackEndPoint) => {
    
            const result = await fetch(`${trackEndPoint}`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
    
            const data = await result.json();
            return data;
        }
        //returning object with getToken and getGenres as its methods
        return {
            getToken(){
                return _getToken();
            },
            getGenres(token){
                return _getGenres(token);
            },
            getPlaylistByGenre(token, genreId) {
                return _getPlaylistByGenre(token, genreId);
            },
            getTracks(token, tracksEndPoint) {
                return _getTracks(token, tracksEndPoint);
            },
            getTrack(token, trackEndPoint) {
                return _getTrack(token, trackEndPoint);
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
        const genres = await APICtrl.getGenres(token);
        
        // const playlist = await APICtrl.getPlaylistByGenre(token, "toplists");
        
        setGenresList(genres.map((genre)=>{return {id: genre.id, name:genre.name}}))
        
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
            {genresList.map((listitem)=>{
                return <li key={listitem.id}>{listitem.name}</li>
            })}
        </div>
    )
}

export default GetData;


