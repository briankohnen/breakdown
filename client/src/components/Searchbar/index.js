import React, { Component } from "react";
import './searchbar.css';
import _axios from '../../utils/caller';
import sifter from '../../utils/sifter';

class Searchbar extends Component {

    state = {
        toSearch: ''
    }

    handleChange = e => {
        this.setState({toSearch: e.target.value});
    };

    handleEnterPress = e => {

        if (e.key === 'Enter' && !(this.state.toSearch.trim() === '')) {

            _axios.searchArtist(this.state.toSearch.trim()).then(res => {

                if (!res.data.message) {

                    this.props.handleGlobalState('topGenres', []);

                    sifter.sift(res.data.toptags.tag, res.data.toptags['@attr'].artist).then(res => {
                        let top3genres = [];

                        for (let i = 0; i < 3; i++) {
                            top3genres.push(res.genres[i].genre);
                        }

                        this.props.handleGlobalState('searchedArtist', res.artist);
                        this.props.handleGlobalState('topGenres', res.genres);

                        _axios.getTops(res.artist, top3genres).then(res => {
                            
                            this.setState({toSearch: ''});

                            if (this.props.modalOpen) {
                                this.props.handleGlobalState('modalOpen', !this.props.modalOpen);
                            }

                            this.props.handleGlobalState('errMessage', "who's next?");
                            this.props.handleGlobalState('topTracksAndRecommendations', res.data);
                            this.props.handleGlobalState('okLoad', true);
                            this.props.handleGlobalState('showResults', true);

                        }).catch(err => {
                            console.log(err);
                            this.props.handleGlobalState('searchBool', 0);
                        }).catch(err => {
                            console.log(err);
                            this.props.handleGlobalState('searchBool', 0);
                        });
                    }).catch(err => {
                        console.log(err);
                        this.props.handleGlobalState('searchBool', 0);
                });
            } else {
                this.props.handleGlobalState('errMessage', 'the artist you supplied could not be found');
            }
        });
    };
    };
    
    render () {
        return (
            <>
                <section className='barWrap'>
                    <input 
                    type='text' 
                    value={this.state.toSearch} 
                    onChange={this.handleChange} 
                    onKeyPress={this.handleEnterPress}
                    >
                    </input>
                </section> 
            </>
        );
    };
}

export default Searchbar;