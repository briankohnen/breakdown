import React, { Component } from 'react';
import Genny from './components/Genny';

class App extends Component {

  state = {
    okLoad: true,
    showResults: false,
    topGenres: undefined,
    topTracksAndRecommendations: undefined,
    topRecommends: undefined,
    searchedArtist: '',
    modalOpen: false,
    errMessage: undefined
  }

  handleGlobalState = (state, value, callback) => {
    this.setState({ [state]: value }, async () => callback);
  };

  render () {
    return (
        <div className="App" id='top'>
          <Genny 
          okLoad={this.state.okLoad}
          showResults={this.state.showResults}
          topGenres={this.state.topGenres}
          searchedArtist={this.state.searchedArtist}
          topTracksAndRecommendations={this.state.topTracksAndRecommendations}
          topRecommends={this.state.topRecommends}
          modalOpen={this.state.modalOpen}
          errMessage={this.state.errMessage}
          handleGlobalState={this.handleGlobalState} 
          />
        </div>
    );
  }
}

export default App;

