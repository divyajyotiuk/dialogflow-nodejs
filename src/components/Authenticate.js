import React from 'react';
import '../styles/Authenticate.css';
import DialogFlow from '../services/dialogFlow';

const auth = require('google-auth-library');

const oauth2client = new auth.OAuth2Client(
  client_id,
  client_secret, 
  'https://localhost:3000');    //callback_uri
const authUrl = oauth2client.generateAuthUrl({
  access_type: 'offline',
  scope: [    // scopes for Dialogflow
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/dialogflow'
  ]
});

class Authenticate extends React.Component {

  constructor(){
    super();
    this.state = {
      setHovered: false
    };
  }

  componentDidMount() {
    let code = this.callBackUriHandler();
    if(code){
      DialogFlow(code, oauth2client);
    }
  }

  onMouseHover = () => {
    this.setState({ setHovered: true });
  }

  onMouseNotHovered = () => {
    this.setState( {setHovered: false });
  }

  onClickHandler = () => {
    this.auth_perform();
  }

  resetUrl = () => {
    window.location.href = 'https://localhost:3000';
  }

  auth_perform = () => {
    window.location.href = authUrl;
  }

  callBackUriHandler = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    return code;
  }
  
  render(){
    return(
      <div>
        <div>
          <button 
          onMouseEnter = { this.onMouseHover }
          onMouseLeave = { this.onMouseNotHovered }
          onClick = { this.onClickHandler }
          className={ this.state.setHovered ? "fancy-btn-hover" : "fancy-btn" }>Authenticate</button>
          <button 
          onClick = { this.resetUrl }
          className="fancy-btn">Reset URL</button>
        </div>
        <div>
          <div className="small-text">You need to authenticate yourself with google before using this app</div>
        </div>
      </div>
    );
  }  
}

export default Authenticate;