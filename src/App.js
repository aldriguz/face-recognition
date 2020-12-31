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
      imageUrl: '',
      box: {
      }
    }
  }

  calculateFaceLocation = (data) => {
    //console.log(data.outputs[0].data.regions[0].region_info.bounding_box)
    //console.log(data['outputs'][0]['data']['regions'][0]['region_info']['bounding_box']); //same as line up

    const faceFound = data['outputs'][0]['data']['regions'][0]['region_info']['bounding_box'];
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: faceFound.left_col * width,
      topRow: faceFound.top_row * height,
      rightCol: width - (faceFound.right_col * width),
      bottomRow: height - (faceFound.bottom_row * width)
    }

  }

  displayFaceBox = (box) => {
    console.warn(box);
    this.setState({'box': box});
  }

  onInputChange = (event) => {
    //console.info(event.target.value);
    this.setState({'input': event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({'imageUrl': this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(console.error);
  }  
  
  render(){
    return (
      <div className="App">
        <Particles className='particles'/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>  
        <FaceRecognition imageUrl={this.state.imageUrl} faceBox={this.state.box}/>
      </div>
    );
  }  
}

export default App;
