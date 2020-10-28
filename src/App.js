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
    const [fb, setFb] = useState(null);
    const [env, setEnv] = useState('stg');
    const [copyFb, setCopyFb] = useState(false);
    const [copyF, setCopyF] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);


    const loginGrus = async (body) => {
        console.log('loginGrus body', body);

        try {
            const response = await fetch(`https://${env}.grusapp.com/auth/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            console.log(response)
            if (response && response.ok) {
                const clone = response.clone();
                const {type} = await clone.blob();
                console.log('type', type)
                const result = await response.json();
                console.log('result', result)
                setLoading(false);
                setData(result);
                return {type, result};
            }

            throw new Error(response);

        } catch (e) {
            console.log('loginGrus Error', JSON.stringify(e));
        }
        setLoading(false);

    }

    const loginGrusFB = fbResponse => {
        console.log('loginGrusFB fbResponse', fbResponse);

        setLoading(true);
        setFb(fbResponse);
        loginGrus({
            temporary_token: fbResponse.accessToken,
            method: 'facebook',
        })
    }


    return (
        <div className="App">
            <header className="App-header">
                <select value={env} onChange={(e) => setEnv(e.target.value)}>
                    <option value="dev">dev</option>
                    <option value="stg">stg</option>
                </select>
                <>{loading ? 'Login FB....' : ''}</>
                <FacebookLogin
                    appId="640793113118437"
                    autoLoad={false}
                    fields="id,name,email,picture"
                    callback={loginGrusFB}
                    cssClass="my-facebook-button-class"
                    icon="fa-facebook"
                />
                {fb &&
                <div className="item">
                    FB response
                    <CopyToClipboard className="copy" text={JSON.stringify(fb)} onCopy={() => setCopyFb(true)}>
                        <pre>{JSON.stringify(fb)}</pre>
                    </CopyToClipboard>
                    {copyFb ? <div>Facebook Copiado</div> : ''}
                </div>
                }
                {data && <>
                    <div className="item">Code: <CopyToClipboard>
                        <pre>{data.code}</pre>
                    </CopyToClipboard></div>
                    <div className="item">Token: <CopyToClipboard>
                        <pre>{data.token}</pre>
                    </CopyToClipboard></div>
                    <div className="item">register: <pre>{JSON.stringify(data.register)} </pre></div>
                </>}
                {
                    user
                        ? <button onClick={signOut}>Sign out</button>
                        : <button onClick={signInWithGoogle}>Sign in with Google</button>
                }
                {
                    user
                        ? <div style={{maxWidth: '50%', fontSize: '12px'}}>
                            <CopyToClipboard className="copy" text={JSON.stringify(user)} onCopy={() => setCopyF(true)}>
                                <pre>{JSON.stringify(user)}</pre>
                            </CopyToClipboard>
                            {copyF ? <span>Firebase Copiado!</span> : ''}
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
