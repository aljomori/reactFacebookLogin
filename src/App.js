import React, {useState} from 'react';
import FacebookLogin from "react-facebook-login";
import CopyToClipboard from 'react-copy-to-clipboard';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import './App.css';

const firebaseApp = firebase.initializeApp(firebaseConfig);

function App({user, signOut, signInWithGoogle}) {
  const [fb, setFb] = useState({});
  const [copyFb, setCopyFb] = useState(false);
  const [copyF, setCopyF] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <FacebookLogin
            appId="414897609429813"
            autoLoad={false}
            fields="name,email,picture"
            callback={(object)=>{setFb(object)}}
            cssClass="my-facebook-button-class"
            icon="fa-facebook"
        />
        <div style={{maxWidth: '50%', fontSize: '12px', marginBottom: '20px'}}>
          <CopyToClipboard  className="copy"  text={JSON.stringify(fb)} onCopy={()=>setCopyFb(true)}>
            <pre>{JSON.stringify(fb)}</pre>
          </CopyToClipboard>
          {copyFb?<div>Facebook Copiado</div>:''}
        </div>

        {
          user
              ? <button onClick={signOut}>Sign out</button>
              : <button onClick={signInWithGoogle}>Sign in with Google</button>
        }
        {
          user
              ?<div style={{maxWidth: '50%', fontSize: '12px'}}>
                <CopyToClipboard className="copy" text={JSON.stringify(user)} onCopy={()=>setCopyF(true)}>
                  <pre>{JSON.stringify(user)}</pre>
                </CopyToClipboard>
                {copyF?<span>Firebase Copiado!</span>:''}
              </div>
              : <div><p>Please sign in.</p></div>
        }

      </header>
    </div>
  );
}
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
