import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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

 const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {
      },
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    //console.log(data.outputs[0].data.regions[0].region_info.bounding_box)
    //console.log(data['outputs'][0]['data']['regions'][0]['region_info']['bounding_box']); //same as line up

    const faceFound = data['outputs'][0]['data']['regions'][0]['region_info']['bounding_box'];
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    //math to the rescue to mark the box in the image
    return {
      leftCol: faceFound.left_col * width,
      topRow: faceFound.top_row * height,
      rightCol: width - (faceFound.right_col * width),
      bottomRow: height - (faceFound.bottom_row * height)
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

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false});      
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({'route': route})
  }
  
  render(){
    const {isSignedIn, imageUrl, box, route} = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>  
              <FaceRecognition imageUrl={imageUrl} faceBox={box}/>
            </div>
          : ( route === 'signin')
              ? <Signin onRouteChange={this.onRouteChange}/> 
              : <Register onRouteChange={this.onRouteChange}/> //route === register
        }
      </div>
    );
  }  
}

export default App;
