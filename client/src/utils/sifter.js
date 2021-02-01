const sifter = {
    artist: '',
    genres: [],
    sift: (data, searchedArtist) => {
        return new Promise((resolve)=> {

            sifter.genres = [];

            let processed = 0;
            sifter.artist = searchedArtist;

            data.forEach(indX => {

                let genreObj = {
                    genre: indX.name,
                    count: indX.count
                };

                sifter.genres.push(genreObj);
                        
                processed++;

                if(processed === 5) {
                    resolve({artist: sifter.artist, genres: sifter.genres});
                };
            });
        });
    }
};

export default sifter;
