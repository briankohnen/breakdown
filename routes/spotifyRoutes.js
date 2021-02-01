const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

console.log(process.env);

const spotify = new SpotifyWebApi({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    accessToken: ''
});

module.exports = function (app) {

    let cleanedResponse = {
        id: '',
        followers: '',
        image: '',
        topTracks: [],
        recommendations: []
    };

    const getRecoms = (artist_id, genres, response) => {

        console.log(artist_id, genres);

        spotify.getRecommendations({
            seed_artists: [artist_id],
            seed_genres: [genres],
            limit: 5
        }).then(res => {

            console.log(res);
            let processed = 0;

            if (res.body.tracks.length === 0 ) {

                response.json(cleanedResponse);
            }

            // Come here for more data on recommendations console.log(res.body)
            res.body.tracks.forEach(elem => {

                let tempCleaning = {
                    trackName: elem.name,
                    artist: elem.artists[0].name,
                    previewURI: elem.uri.substr(14)
                };

                spotify.search(elem.artists[0].name, ['artist']).then(resp => {

                    tempCleaning['imageURI'] = resp.body.artists.items[0].images[1].url;

                    cleanedResponse.recommendations.push(tempCleaning);

                    processed++;

                    if (processed===res.body.tracks.length) {

                        response.json(cleanedResponse);
                    }

                });
            });

        });
    };

    app.post("/searchartist", (request, response) => {

        const findify = (artist) => {
            spotify.clientCredentialsGrant().then(data => {

                spotify.setAccessToken(data.body['access_token']);

                spotify.search(artist, ['artist']).then(res => {

                    const _artist = res.body.artists.items[0];

                    spotify.getArtistTopTracks(res.body.artists.items[0].id, 'US').then(res => {

                        cleanedResponse = {
                            id: _artist.id,
                            followers: _artist.followers.total,
                            image: _artist.images[0].url,
                            topTracks: [],
                            recommendations: []
                        }

                        let trackCounter = 0;

                        res.body.tracks.forEach(elem => {
                            trackCounter++;
                            if (trackCounter < 6) {
                                let tempTrackObj = {
                                    trackName: elem.name,
                                    previewURI: elem.uri.substr(14)
                                };
                                cleanedResponse.topTracks.push(tempTrackObj);
                            }
                        });

                        request.body.genres.push(_artist.genres[0]);
                        
                        getRecoms(_artist.id, request.body.genres, response);

                    }).catch(err => {
                        console.log(err);
                    });

                }).catch(err => {
                    console.log(err);
                });
            });
        };

        findify(request.body.artist); 

    });

    app.post('/recommendations', (request, response) => {

        console.log(request.body);

        cleanedResponse.recommendations = [];

        getRecoms(request.body.artist, request.body.genres, response);

    });
};