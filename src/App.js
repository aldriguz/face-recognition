import React, { Component } from 'react';
import {apiHost} from './constants';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
//import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

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
  boxes: [],
  route: 'signin',
  isSignedIn: true,
  isProfileOpen: false,
  user: {
    id: 0,
    name: '',
    email: '',
    entries: 0,
    joined_at: '',
    pet: '',
    age: ''
  },
  
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
        joined_at: data.joined_at
      }
    })
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');

    if (token) {
      fetch(`${apiHost}/signin`, {
        'method': 'post',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(res => res.json())  
      .then(data => {
        if(data && data.id){
          //console.log('success, we need to get user profile');
          fetch(`${apiHost}/profile/${data.id}`, {
            'method': 'get',
            'headers': {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if(user && user.email){
              this.loadUser(user);
              this.onRouteChange('home');
            }
          })
        }
      })
      .catch(console.error);
    }
  }


  calculateFaceLocation = (data) => {
    if(data && data.outputs){
      const regionsResponse = data['outputs'][0]['data']['regions'];
      const facesArray = regionsResponse.map( region => {
        const faceFound = region['region_info']['bounding_box'];
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
  
        return {
          leftCol: faceFound.left_col * width,
          topRow: faceFound.top_row * height,
          rightCol: width - (faceFound.right_col * width),
          bottomRow: height - (faceFound.bottom_row * height)
        };
      })
     
      //math to the rescue to mark the box in the image
      return facesArray;
    }
    
    return;
  }

  displayFaceBox = (boxes) => {
    //console.warn(boxes);
    if (!boxes)
      return
    this.setState({'boxes': boxes});
  }

  onInputChange = (event) => {
    //console.info(event.target.value);
    this.setState({'input': event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({'imageUrl': this.state.input});

    fetch(`${apiHost}/imageUrl`, {
            'method': 'post',
            'headers': {
              'Content-Type': 'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            'body': JSON.stringify({
                input: this.state.input
            })
          })
          .then( response => response.json())
          .then(response => {
            if(response){
              fetch(`${apiHost}/image`, {
                'method': 'put',
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': window.sessionStorage.getItem('token')
                },
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
            //console.log(response);
            this.displayFaceBox(this.calculateFaceLocation(response))            
          })
          .catch(console.error);
  }  

  onRouteChange = (route) => {
    //console.log('route', route);
    if (route === 'signout'){
      this.setState(initialState);      
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({'route': route})
  }
  

  toogleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  }

  /**
   * main render app, the app render starts here
   */
  render(){
    const {isSignedIn, imageUrl, boxes, route, user, isProfileOpen} = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toogleModal={this.toogleModal}/>
        { isProfileOpen &&
            <Modal>
              <Profile 
                isProfileOpen={isProfileOpen} 
                toogleModal={this.toogleModal} 
                loadUser={this.loadUser}
                user={user}/>
            </Modal>
        }
        { route === 'home' 
          ? <div>
              <Logo />
              
              <Rank username={user.name} entries={user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>  
              <FaceRecognition imageUrl={imageUrl} faceBoxes={boxes}/>
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
