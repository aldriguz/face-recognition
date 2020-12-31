import React from 'react';

const FaceRecognition = ({imageUrl}) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img alt='people happy' src={imageUrl} width='300px' height='auto'/>
            </div>            
        </div>
    );
}


export default FaceRecognition;