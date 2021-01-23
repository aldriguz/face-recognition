import React from 'react';
import '../FaceRecognition/FaceRecognition.css';

const FaceBox = ({faceBox}) => {

    return (
        <div className='bounding-box' 
            style={{
                    top: faceBox.topRow, 
                    right: faceBox.rightCol, 
                    bottom: faceBox.bottomRow, 
                    left: faceBox.leftCol
                }}
            >        
        </div>
    );
}

export default FaceBox;