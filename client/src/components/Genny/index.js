import React, { Component } from "react";
import './genny.css';
import Searchbar from '../Searchbar';
import Results from '../Results';

class Genny extends Component {
  
    render () {
        return (
            <>

            <section className='lander'>

                <h1>breakdown<span>.</span></h1>

                <div className={'tutSpacer ' + (this.props.showResults ? 'fadeout' : '')}>
                    <p>{!this.props.errMessage ? 'enter your favorite band/artist to get started' : this.props.errMessage}</p>
                    <Searchbar handleGlobalState={this.props.handleGlobalState} modalOpen={this.props.modalOpen} />
                </div>

                <div className={'results ' + (this.props.showResults ? 'show' : '')}>
                    <Results
                    okLoad={this.props.okLoad}
                    showResults={this.props.showResults}
                    topGenres={this.props.topGenres} 
                    searchedArtist={this.props.searchedArtist}
                    topTracksAndRecommendations={this.props.topTracksAndRecommendations}
                    topRecommends={this.props.topRecommends}
                    modalOpen={this.props.modalOpen}
                    errMessage={this.props.errMessage}
                    handleGlobalState={this.props.handleGlobalState}
                    />
                </div>
                
            </section>
            </>

        );
    };
}

export default Genny;