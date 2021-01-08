import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
//import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import React, { Component } from 'react';



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


const initialState = {
  input: '',
  imageUrl: '',
  box: {
  },
  route: 'signin',
  isSignedIn: false,
  user: {
    id: 0,
    name: '',
    email: '',
    entries: 0,
    joinedAt: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

/**
 * app event methods and others 
 */
  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joinedAt: data.joinedAt
      }
    })
  }

  componentDidMount() {
    fetch('http://localhost:4000')
      .then(response => response.json())
      .then(console.log);
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

    fetch('http://localhost:4000/imageUrl', {
            'method': 'post',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
                input: this.state.input
            })
          })
          .then( response => response.json())
          .then(response => {
            if(response){
              fetch('http://localhost:4000/image', {
                'method': 'put',
                'headers': {'Content-Type': 'application/json'},
                'body': JSON.stringify({
                    id: this.state.user.id
                })
              })
                .then(response => response.json())
                .then(count => 
                  this.setState( Object.assign(this.state.user, {entries: count}) )
                )
                .catch(console.warn);
                
            }
    
            this.displayFaceBox(this.calculateFaceLocation(response))
          })
          .catch(console.error);
  }  

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState);      
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({'route': route})
  }
  

  /**
   * main render app, the app render starts here
   */
  render(){
    const {isSignedIn, imageUrl, box, route, user} = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank username={user.name} entries={user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>  
              <FaceRecognition imageUrl={imageUrl} faceBox={box}/>
            </div>
          : ( route === 'signin')
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> //route === register
        }
      </div>
    );
  }  
}

export default App;
