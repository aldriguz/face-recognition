import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.info(event.target.value);
  }

  onButtonSubmit = (event) => {
    console.info(event);
  }  
  
  render(){
    return (
      <div className="App">
        <Particles className='particles'/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onClick={this.onButtonSubmit}/>  
      </div>
    );
  }  
}

export default App;
