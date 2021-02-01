import axios from "axios";
import _sift from './sifter';

const apiBase = 'http://ws.audioscrobbler.com/2.0/';
const apiKey = 'd8ddc0505406eddebd0641379e607c47';

export default {
    searchArtist: (artist) => {
        return axios.request({
            method: 'GET',
            url: `${apiBase}?method=artist.gettoptags&artist=${artist}&api_key=${apiKey}&autocorrect=1&format=json`,
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