import axios from "axios";
import _sift from './sifter';
require('dotenv').config();

const apiBase = 'https://ws.audioscrobbler.com/2.0/';

export default {
    searchArtist: (artist) => {
        return axios.request({
            method: "POST",
            url: "/lastfmgrab"
        }).then(res => {
            const lfmk = res.data;
            return axios.request({
                method: 'GET',
                url: `${apiBase}?method=artist.gettoptags&artist=${artist}&${lfmk}&autocorrect=1&format=json`
            });
        });
    },
    getTops: (artist, genres) => {
        return axios.request({
            method: "POST",
            url: "/searchartist",
            data: {artist: artist, genres: genres}
        });
    },
    getRecoms: (artist, genres) => {
        return axios.request({
            method: "POST",
            url: "/recommendations",
            data: {artist: artist, genres: genres}
        });
    }
};