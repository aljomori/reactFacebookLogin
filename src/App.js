import React, {useState} from 'react';
import logo from './logo.svg';
import FacebookLogin from "react-facebook-login";
import './App.css';

function App() {
  const [fb, setFb] = useState({});
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FacebookLogin
            appId="414897609429813"
            autoLoad={true}
            fields="name,email,picture"
            callback={(object)=>{setFb(object)}}
            cssClass="my-facebook-button-class"
            icon="fa-facebook"
        />
        <p style={{maxWidth: '50%', fontSize: '12px'}}>
          <pre>{JSON.stringify(fb)}</pre>
        </p>
      </header>
    </div>
  );
}

export default App;
