import React from 'react';
import {apiHost} from '../../constants';

class Signin extends React.Component {
    constructor() {
        super();
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }        
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }


    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    saveAuthTokenInSession = (token) => {
        console.log('sessionStorage', token);

        window.sessionStorage.setItem('token', token);
    }

    onSubmitSignIn = () => {
        console.log(this.state);
        
        fetch(`${apiHost}/signin`, {
            'method': 'post',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                if( data && data.userId && data.success === 'true' ){
                    this.saveAuthTokenInSession(data.token);
                   
                    fetch(`${apiHost}/profile/${data.userId}`, {
                        'method': 'get',
                        'headers': {
                          'Content-Type': 'application/json',
                          'Authorization': data.token
                        }
                      })
                      .then(resp => resp.json())
                      .then(user => {
                        if(user && user.email){
                          this.props.loadUser(user);
                          this.props.onRouteChange('home');
                        }
                      })
                } else {
                    console.error('data', data);
                } 
            });
    }

    render() {
        const {onRouteChange } = this.props;
        return (
            <article className="mw6 center ba dark-gray b--black-50 br3 pa3 pa4-ns mv3 shadow-5">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email"
                                    name="email-address" 
                                    id="email-address"  
                                    onChange={this.onEmailChange}/>
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    onChange={this.onPasswordChange}/>
                            </div>                        
                        </fieldset>
                        <div className="">
                            <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>  
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;