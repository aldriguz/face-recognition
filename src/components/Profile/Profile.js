import React from 'react';
import './Profile.css';
import {apiHost} from '../../constants';

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.user.name,
            age: this.props.user.age,
            pet:  this.props.user.pet,
        }
    }

    onFormChange = (event) => {
        console.log('aaa');
        switch(event.target.name){
            case 'user.name':
                this.setState({name: event.target.value});
                break;
            case 'user.age':
                this.setState({age: event.target.value});
                break;
            case 'user.pet':                
                this.setState({pet: event.target.value});
                break;
            default:
                break;
        }
    }

    onProfileUpdate = (data) => {
        fetch(`${apiHost}/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({formInput: data})
        }).then(resp => {
            this.props.toogleModal();
            this.props.loadUser({...this.props.user, ...data});
        }).catch(console.log);
    }

    render() {
        const {user} = this.props; 
        const {name, age, pet} = this.state;        

        return (
            <div className="profile-modal">
                <article className="mw8 center ba dark-gray b--black-50 br3 pa3 pa4-ns mv3 shadow-5 bg-white">
                    <main className="pa8 black-80 w-100">
                        <img
                            src="http://tachyons.io/img/logo.jpg"
                            className="br-100 ba h3 w3 dib" alt="avatar" 
                        />
                        <h2>{this.state.name}</h2>
                        <h6>{`Images Submitted: ${user.entries}`}</h6>
                        <p>{`Member since: ${new Date(user.joined_at).toLocaleDateString()}`}</p>
                        <hr />
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name:</label>
                        <input 
                            className="pa2 input-reset ba hover-bg-black hover-white w-100" 
                            onChange={this.onFormChange}
                            placeholder={user.name}
                            type="text" 
                            name="name" 
                            id="name" />
                        <label className="db fw6 lh-copy f6" htmlFor="name">Age:</label>
                        <input 
                            className="pa2 input-reset ba hover-bg-black hover-white w-100" 
                            onChange={this.onFormChange}
                            type="number" 
                            name="age" 
                            id="age" />
                        <label className="db fw6 lh-copy f6" htmlFor="name">Pet:</label>
                        <input 
                            className="pa2 input-reset ba hover-bg-black hover-white w-100" 
                            onChange={this.onFormChange}
                            type="text" 
                            name="pet" 
                            id="pet" />
                        <hr />
                        <div class="flex items-center justify-center pa8">
                            <button  
                                className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue"
                                onClick={() => this.onProfileUpdate({name, age, pet})}>
                                Save
                            </button>
                            <button 
                                className="f6 link dim br2 ph3 pv2 mb2 ml2 dib white bg-dark-red"
                                onClick={this.props.toogleModal}>
                                Cancel
                            </button>
                        </div>    
                    </main>
                    <div className="modal-close" onClick={this.props.toogleModal}>&times;</div>
                </article>            
            </div>
        )
    };
    
}

export default Profile;