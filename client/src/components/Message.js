import React from 'react';
import '../styles/styles.css';

export class Message extends React.Component {

    render() {
        let date = new Date(this.props.createdAt)
        return (
            <div className="message" style={{background:this.props.color}}>
                <p className="meta">{this.props.senderName} 
                    <span style={{marginLeft:10}}>{date.getHours()}:{date.getMinutes()}</span>
                </p>
                <p className="text">
                    {this.props.text}
                </p>
            </div>
        )
    }
}






 