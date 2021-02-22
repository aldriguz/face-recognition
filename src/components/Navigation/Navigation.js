import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon'

const Navigation = ({onRouteChange, isSignedIn, toogleModal}) => {
    if (isSignedIn) {        
        return (
            <nav style={{display: 'flex', justifyContent:'flex-end'}}>
                <ProfileIcon onRouteChange={onRouteChange} toogleModal={toogleModal}/>                
            </nav>
        );
    } else {
        return (
            <nav style={{display: 'flex', justifyContent:'flex-end'}}>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim white underline pa3 pointer'>Sign in</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim white underline pa3 pointer'>Register</p>
            </nav>
        );
    }
    
}

export default Navigation;