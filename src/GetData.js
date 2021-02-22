import React, { useEffect, useState } from 'react';

let tracksData = [];
let tracksToShow = [];

const GetData = ()=>{

const [genresList, setGenresList] = useState([]);
const [trackList, setTrackList] = useState([{trackid:"",trackname:"", trackartist:"", trackimage:""}]);

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

            const result = await fetch(`https://api.spotify.com/v1/browse/categories?country=IN&locale=in_IN&limit=10`, {
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
        
        const playlist = await APICtrl.getPlaylistByGenre(token, genres[0].id);
        console.log(playlist);

        for(let i=0;i<playlist.length; i++){
            tracksData[i] = await APICtrl.getTracks(token, playlist[i].tracks.href);
        }
        for(let i=0;i<tracksData.length; i++){
            for(let j=0; j<5; j++){
                if(tracksData[i][j]==undefined){
                    break;
                }
                if(tracksToShow.includes(tracksData[i][j].trackid)){
                    continue;
                }
                tracksToShow.push({trackid: tracksData[i][j].track.id, trackname: tracksData[i][j].track.name, trackartist: tracksData[i][j].track.artists.map((e)=>e.name), trackimage: tracksData[i][j].track.album.images[0].url})
            }
        }
        setTrackList(tracksToShow);
        
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
        <div style={{display:"flex"}}>
            <div>
                {genresList.map((listitem)=>{
                    return <li id="listitem.id" key={listitem.id}>{listitem.name}</li>
                })}
            </div>
            <br/>
            <div style={{backgroundColor:"pink"}}>
                {
                    trackList.map((listitem)=>{
                        return (<li id="listitem.trackid" key={listitem.trackid}>
                                    {listitem.trackname}
                                </li>)
                    })
                }
            </div>
        </div>
    )
}

export default GetData;


