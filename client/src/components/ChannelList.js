import React from 'react';
import Channel from './Channel';
import User from './User'
import { Button } from 'react-bootstrap'

export class ChannelList extends React.Component {

    handleClick = data => {
        this.props.onSelectChannel(data);
    }
    logout = () => {
        if (window.confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
            this.props.setUsername("")
        }
    }

    render() {
        let list = <div className="no-content-message">There is no channels to show</div>;
        let userList = <div className="no-content-message">There is no any user yet</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map(c => <Channel key={c.id} id={c.id} name={c.name} members={c.members} onClick={this.handleClick} />);
        }
        if (this.props.users && this.props.users.map) {
            userList = this.props.users.map(u => <User key={u._id} id={u._id} username={u.username} onClick={this.handleClick} status={u.status} />);
        }
        return (
            <div className='channel-list' style={{ flexDirection: "column", flex: 1 }}>
                <span style={{fontSize:30, paddingLeft:20}}>
                    {this.props.username} <Button onClick={this.logout} style={{ borderRadius: 5, margin: 5, marginLeft: 50}}> Çıkış</Button>     
                </span>

                <div style={{ flex: 1 }}>
                    {list}

                </div>
                <div style={{ width: 250, height: 2, background: "white" }}> </div>
                <span style={{ margin: 7 }}>
                    <input placeholder="Kullanıcı ara"
                        onChange={(e) => this.props.filterUsers(e.target.value)}
                        style={{ borderRadius: 6, height: 36, marginLeft: 30 }} />
                </span>
                <div className="scroll-div" >
                    {userList}
                </div>

            </div>);
    }

}