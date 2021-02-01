import React, { Component } from "react";
import './results.css';
import Searchbar from '../Searchbar';
import { Doughnut } from 'react-chartjs-2';
import Checkbox from '../Checkbox';
import _axios from '../../utils/caller';

class Results extends Component {

    state = {
        loaded: false,
        preview: '',
        artistImage: '',
        checkboxes: {},
        checksLoaded: false,
        topGenres: '',
        recommendations: []
    }

    chartData = {
        labels: [],
        datasets: [
            {
                label: 'Genre Breakdown',
                backgroundColor: ['rgb(39, 118, 80)', 'rgb(41, 82, 109)', 'rgb(51, 54, 118)', 'rgb(151, 50, 82)', 'rgb(170, 88, 57)',
                'rgb(170, 121, 57)', 'rgb(88, 42, 114)', 'rgb(136, 45, 96)','rgb(78, 146, 49)','rgb(136, 162, 54)'
                ],
                data: [20, 30, 50],
            }
        ]
    };

    chartLegend = {
        labels: {
            fontColor: 'rgb(255, 255, 255)'
        }
    };

    chartReference = {};

    cleanData = () => {

        this.setState({topGenres: this.props.topGenres}, async() => {

            this.setState({loaded: false});

            this.chartData.labels = [];
            this.chartData.datasets[0].data = [];

            let tempGenrePopularity = [];

            for (let i = 0; i < 5; i++) {
                this.chartData.labels.push(this.state.topGenres[i].genre.toLowerCase());
                tempGenrePopularity.push(this.state.topGenres[i].count);
            }

            let reduced = tempGenrePopularity.reduce((a, b) => a + b)

            // adjusted popularity values to %'s of 100
            this.chartData.datasets[0].data = tempGenrePopularity.map(value => Math.round((value / reduced) * 100));

            this.setState({artistImage: this.props.topTracksAndRecommendations.image});

            this.props.handleGlobalState('okLoad', false);
            this.setState({loaded: true});

            this.topsRenderer('topTracks');
            this.topsRenderer('recommendations');

            this.recommendBoxes();
        });

    };

    toppers = [];
    tempRecommendations = [];

    setPreview = (e) => {
        this.setState({preview: e.target.dataset.preview});
        // this.setState({active: e.target.dataset.preview});
        // console.log(this.state.preview, this.state.active);
    };

    topsRenderer = (whatRender) => {

        let rank = 0;
        if (whatRender === 'topTracks') {
            this.toppers = [];
            this.setState({preview: this.props.topTracksAndRecommendations[whatRender][0].previewURI});
        } else {
            this.setState({recommendations: []});
            this.tempRecommendations = [];
        }

        this.props.topTracksAndRecommendations[whatRender].forEach(elem => {
            rank++;
            let trackName = elem.trackName;
            let preview = elem.previewURI;
            let artist = elem.artist;
            let image = elem.imageURI;
            if (whatRender === 'topTracks') {
                this.toppers.push(<li className={this.state.preview === this.state.active ? 'active' : ''} key={rank} id={rank} data-preview={preview} onClick={this.setPreview}><span className='rankNumber'>{rank}.</span> {trackName}</li>);
            } else {
                this.tempRecommendations.push(
                <li
                className={this.state.preview === this.state.active ? 'active' : ''} 
                key={preview} 
                id={preview}  
                onClick={this.setPreview}>

                    <div data-preview={preview} className='recommendationBox' style={{'backgroundImage': `url("${image}")`}}>
                        <div data-preview={preview} className='textbackdrop'>
                            <h1 data-preview={preview}>{trackName}</h1>
                            <h3 data-preview={preview}>{artist}</h3>
                        </div>
                    </div>

                     
                </li>);
            }
        });
        console.log(this.tempRecommendations);
        this.setState({recommendations: this.tempRecommendations});

    };

    recommendChecks = [];

    recommendBoxes = () => {

        let tempCheckboxState = {
            [this.props.searchedArtist.toLowerCase()]: {
                checked: true
            }
        }

        this.chartData.labels.forEach(elem => {
            tempCheckboxState[elem] = {
                checked: true
            }
        });

        this.setState({checkboxes: tempCheckboxState}, async () => {
            this.renderCheckBoxes();
        });
    };

    handleInputCheck = (e) => {

        this.setState({checksLoaded: false});

        this.setState(prevState => ({
            checkboxes: {
                ...prevState.checkboxes,
                [e.target.name]: {
                    checked: !prevState.checkboxes[e.target.name].checked
                }
            }
        }), async () => {
            this.recommendChecks = [];
            this.renderCheckBoxes();
        });
    };

    renderCheckBoxes = () => {
        this.recommendChecks = [];

        let key = 0;

        this.recommendChecks.push(<Checkbox 
            onCheckboxChange={this.handleInputCheck} 
            key={this.props.searchedArtist.toLowerCase()+key} 
            name={this.props.searchedArtist.toLowerCase()} 
            checked={this.state.checkboxes[this.props.searchedArtist.toLowerCase()].checked}/>
        );

        key++;

        this.chartData.labels.forEach(elem => {

            this.recommendChecks.push(
                <Checkbox onCheckboxChange={this.handleInputCheck} key={elem+key} name={elem} checked={this.state.checkboxes[elem].checked}/>
            );

            key++;
        });

        this.setState({checksLoaded: true});
    };

    callForMoreRecommendations = () => {

        let tempQueries = Object.entries(this.state.checkboxes);

        tempQueries.shift();
        let tempGenresArray = [];

        tempQueries.forEach(elem => {
            const [name, value] = elem;
            if (value.checked) {
                tempGenresArray.push(name);
            }
        });

        _axios.getRecoms([], tempGenresArray).then(res => {
            this.props.handleGlobalState('topTracksAndRecommendations', res.data, this.topsRenderer('recommendations'));
        }).catch(err => {
            console.log(err);
        });

    };

    triggerModal = () => {
        this.props.handleGlobalState('modalOpen', !this.props.modalOpen);
    };
    

    componentDidUpdate() {
        if (this.props.topGenres&&this.props.topTracksAndRecommendations&&this.props.okLoad) {
            this.cleanData();
        }
    }

    render() {

        let titlePlayerImg = {
            backgroundImage: `url(${this.state.artistImage})`
        }

        return (
            <>
            <section className='resultsWrapper'>
                
            <div className='title-player' style={titlePlayerImg}>
                <div className='title'>
                    <p><span className='artistName'>{this.props.searchedArtist}</span></p>
                </div>
            </div>

            <div className='resultsLoader'>
                
                <div className='topTracks'>
                    <h1>Popular tracks</h1>
                    <ul>
                        {this.toppers}
                    </ul>
                </div>

                <div className='genres'>
                    <h1>Genre breakdown</h1>
                    <div className='donutWrapper'>
                        {!this.state.loaded ? 
                        <></>
                        :
                        <Doughnut
                        ref={(reference) => this.chartReference = reference}
                        data={this.chartData} 
                        legend={this.chartLegend}
                        /> 
                        }
                    </div>
                </div>

                <div className='recommendations'>
                    <ul>
                        {this.state.recommendations}

                        <div className='checkers'>
                            {!this.state.checksLoaded ? 
                            <></>
                            :
                            this.recommendChecks
                            }

                            <div className='grabRecomsButton' onClick={this.callForMoreRecommendations}>
                                get new recommendations
                            </div>
                        </div>

                    </ul>

                    <div className='player'>
                        <iframe src={`https://open.spotify.com/embed/track/${this.state.preview}`} width="300" height="70" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    </div>
                </div>
            </div>

            </section>

            <aside className={this.props.modalOpen === false ? 'searchButtonLow' : 'searchButtonHigh'}>
                <span onClick={this.triggerModal}><a href='#top' title='search again?'><i className="fa fa-search"></i></a></span>

                <div className={this.props.modalOpen === false ? `searchModal hidden` : `searchModal shown`}>
                    <Searchbar handleGlobalState={this.props.handleGlobalState} modalOpen={this.props.modalOpen} />
                    {this.props.errMessage}
                </div>

            </aside>

            </>
        );

    };
};

export default Results;