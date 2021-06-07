import React from 'react';


export default class User extends React.Component {

    click = () => {
        this.props.onClick({channelId: this.props.id, receiverType:"PRIVATE", username:this.props.username});
    }

    render() {
        return (
            <div className='channel-item' onClick={this.click}>
                <div>{this.props.username}</div>
                <span>{this.props.status === "ONLINE" ? "online" : "offline" }</span>
            </div>
        )
    }
}