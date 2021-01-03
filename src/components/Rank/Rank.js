import React from 'react';

const Rank = ({username, entries}) => {
    return (
        <div>
            <div className='white f2'>
                {`${username}, your current entry count is...`}
            </div>
            <div className='white f1'>
                {entries}
            </div>
        </div>

    );
}

export default Rank; 