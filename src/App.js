import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import React, { Component } from 'react';

const app = new Clarifai.App({
  apiKey: '514ae3e3dae449c28602447b1803d951'
 });


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    //console.info(event.target.value);
    this.setState({'input': event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({'imageUrl': this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
            console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
      })
      .catch(console.log);
  }  
  
  render(){
    return (
      <div className="App">
        <Particles className='particles'/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>  
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }  
}

export default App;
