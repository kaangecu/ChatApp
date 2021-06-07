import React from 'react';
import { Message } from './Message';
import '../styles/styles.css';

export class MessagesPanel extends React.Component {
    state = { input_value: '' }
    send = () => {
        if (this.state.input_value && this.state.input_value != '') {
            this.props.onSendMessage(this.state.input_value);
            this.setState({ input_value: '' });
        }
    }

    handleInput = e => {
        this.setState({ input_value: e.target.value });
    }

    render() {

        let list = <div className="no-content-message" style ={{fontSize:50}}>WELCOME...</div>;
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map(m => <Message key={m._id} id={m.id} 
                                                        createdAt={m.created} 
                                                        senderName={m.from} 
                                                        text={m.content}
                                                        color={this.props.username===m.from? "#e6e9ff":"#bfc3dd"}/>);
        }
        return (
            <div className='messages-panel'>
                <div style={{fontSize:45,color:"#7386ff",marginBottom:5,marginLeft:30}}>{this.props.current}</div>
                <div className="chat-messages">
                    
                    {list}
                </div>
                {this.props.channel &&
                    <div className="messages-input">
                        <input type="text" onChange={this.handleInput} value={this.state.input_value} style={{height:50}}/>
                        <button onClick={this.send} style={{height:40,width:80}}>Send</button>
                    </div>
                } 
            </div>);
    }

}