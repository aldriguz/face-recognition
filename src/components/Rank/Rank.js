import React from 'react';

const apiRank = "https://sqw2ixvcd8.execute-api.us-east-1.amazonaws.com/rank";

class Rank extends React.Component {//= ({username, entries}) => {
    
    constructor(){
        super();
        this.state = {
            emoji: ''
        }
    }

    componentDidMount() {
        this.generateEmoji(this.props.entries);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.entries === this.props.entries && prevProps.name === this.props.name){
            return null;
        }

        this.generateEmoji(this.props.entries);
    }

    generateEmoji = (entries) => {
        fetch(`${apiRank}?rank=${entries}`)
            .then(res => res.json())
            .then(data => this.setState({emoji: data.input}))
            .catch(console.error);
    }

    render() {
        const {username, entries} = this.props;

        return (
            <div>
                <div className='white f2'>
                    {`${username}, your current entry count is...`}
                </div>
                <div className='white f1'>
                    {entries}
                </div>
                <div className='white f2'>
                    {`Rank Badge: ${this.props.emoji}`}
                </div>
            </div>
    
        );
    }
}

export default Rank; 