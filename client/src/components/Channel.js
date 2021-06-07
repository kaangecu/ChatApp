import React from 'react';


export default class Channel extends React.Component {

    click = () => {
        this.props.onClick({channelId: this.props.id, receiverType:"PUBLIC" });
    }

    render() {
        return (
            <div className='channel-item' onClick={this.click}>
                <div>{this.props.name}</div>
                <span>Kullanıcılar:{this.props.members}</span>
            </div>
        )
    }
}