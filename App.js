// Exported from snack.expo.io
import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Image, Button, Alert } from 'react-native';
import { Constants, Audio } from 'expo';

const apiToken = 'BQBAIhfyjziI56lRNlAXPRjNenExKeqZUZunw__9AcQsUlLkAk-8dpDfYLRbOrt6c9yfbJzxgFOwILXZNpamYxLcM85YYMiKl8oH_XmyyHFRocZPmMx_WiRaCNZrVIoXB942Os1L5RrS4x_C1Q';

class TrackImage extends Component {
  render() {
    const src = this.props.track.album.images[0].url; // A changer :)
    return <Image source={{ uri: src }} style={{ width: 200, height: 200 }}  />;
  }
}

class GuessButton extends Component {
  render() {
    return (
      <View>
        <Button title={this.props.track.name} color="#1B8A8A" onPress={this.props.onPress}/>
      </View>
    )
  }
}

export default class App extends Component {
    constructor() {
    super();
    this.state = {
      savedTracks: null,
      currentTrackId: 0,
      goodAnswers: 0,
    };
  }
  
  componentDidMount(){
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
          console.log("Data received"),
          this.setState({savedTracks: data.items}, 
          () => this.startNewSong());
       })
       .catch((error) => console.log(error));
  }
  
  startNewSong(){
    const randomTrackId = Math.floor(Math.random() * this.state.savedTracks.length);
    const track = this.state.savedTracks[randomTrackId].track;
    this.setState({currentTrackId: randomTrackId});
    this._playSound(track.preview_url);
  }
  
  sleep = ms => {
    return new Promise(res => setTimeout(res, ms));
  }

  _playSound = async url => {
    console.log('Starting ' + url);
    await Audio.setIsEnabledAsync(true);
    if (this.sound) this.sound.stopAsync();
    this.sound = new Audio.Sound();
    if (url !== null) {
      await this.sound.loadAsync({
        uri: url,
      });
      await this.sound.playAsync();
    }
    console.log(0);
    await this.sleep(30000);
    console.log(30);
    this.startNewSong();
  };
  
  _onWin = () => {
    const cntGoodAnswers = this.state.goodAnswers + 1;
    this.setState({goodAnswers: cntGoodAnswers});
    Alert.alert('Bonne réponse ! :)');
    this.startNewSong();
  };

  _onLose = () => {
    Alert.alert('Mauvaise réponse.. :(');
    this.startNewSong();
  };
  
  render() {
    if (!this.state.savedTracks) {
      return(
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    }
    
    const currentTrackId = this.state.currentTrackId;
    const nextTrackId = (currentTrackId + 1) % this.state.savedTracks.length;
    const next2TrackId = (currentTrackId + 2) % this.state.savedTracks.length;
    
    const currentTrack = this.state.savedTracks[currentTrackId].track;
    const nextTrack = this.state.savedTracks[nextTrackId].track;
    const next2Track = this.state.savedTracks[next2TrackId].track;
    
    return (
      <View style={styles.container}>
        <TrackImage track={currentTrack} />
        <GuessButton track={next2Track} onPress={this._onLose}/>
        <GuessButton track={currentTrack} onPress={this._onWin} />
        <GuessButton track={nextTrack} onPress={this._onLose}/>
        <Text style={styles.paragraph}> Bonnes réponses : {this.state.goodAnswers} </Text>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
