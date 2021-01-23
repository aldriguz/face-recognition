import React from 'react';
import FaceBox from '../FaceBox/FaceBox'; 
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, faceBoxes}) => {
    
    console.log('faceboxes', faceBoxes);

    const faceBoxesArray = faceBoxes.map( (faceBox, i) => {
        return <FaceBox faceBox={faceBox}></FaceBox>;
    });

    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' alt='' src={imageUrl} width='300px' height='auto'/>
                {faceBoxesArray}                
            </div>            
        </div>
    );
}


export default FaceRecognition;
