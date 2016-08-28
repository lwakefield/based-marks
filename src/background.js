import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = {
    apiKey: "AIzaSyCF61pRrZ9ZdAl2aHUSJvBOv9SIhovtaUc",
    authDomain: "based-marks.firebaseapp.com",
    databaseURL: "https://based-marks.firebaseio.com",
}
firebase.initializeApp(config)

function addMessageListener(action='', callback, external=false) {
    const onFn = external
        ? chrome.runtime.onMessageExternal
        : chrome.runtime.onMessage
    onFn.addListener((request, sender, sendResponse) => {
        if (!action || request.action === action)
            callback(request, sender, sendResponse)
    })
}

class Server {
    constructor () {
        this.watchExternalAuth()
        this.watchAuth()

        if (Auth.authToken) this.authorize()
    }

    watchExternalAuth () {
        addMessageListener('setAuth', (request, sender, sendResponse) => {
            console.log(request);
            let {credential, user} = request.val;
            localStorage['user'] = JSON.stringify(user)
            localStorage['credential'] = JSON.stringify(credential)

            this.authorize()
        }, true)
    }

    authorize () {
        const ghProvider = firebase.auth.GithubAuthProvider
        const credential = ghProvider.credential(Auth.authToken)
        firebase.auth().signInWithCredential(credential)
    }

    watchAuth () {
        firebase.auth().onAuthStateChanged(user => {
            if (user)
                this.loadDatabase()
            else
                this.unloadDatabase()
        })
    }

    loadDatabase () {
        this.database.on('value', snapshot => {
            localStorage['bookmarks'] = JSON.stringify(snapshot.val())
        })
    }

    unloadDatabase () {
        this.database.off('value')
        delete localStorage['bookmarks']
    }

    get database () {
        let user = firebase.auth().currentUser
        return firebase.database().ref(`user/${user.uid}/bookmarks`)
    }
}

const Auth = {
    get credential () {
        if (localStorage['credential'])
            return JSON.parse(localStorage['credential'])
        return undefined
    },
    get authToken () {
        const credential = Auth.credential
        if (credential)
            return credential.accessToken
        return undefined
    }
}

new Server

const changeIcon = () => {}

// function changeIcon() {
//     chrome.tabs.query({active: true}, function(tabs){
//         const tab = tabs[0]
//         const icon = hasBookmark(tab.url) ? 'starf-38.png' : 'star-38.png'
//         chrome.browserAction.setIcon({path: icon});
//     });
// }

// function hasBookmark (url) {
//     const bookmarks = STORE.bookmarks
//     for (let key of Object.keys(bookmarks)) {
//         const val = bookmarks[key]
//         if (val.url === url) return true
//     }
//     return false
// }

chrome.tabs.onActivated.addListener(changeIcon)
chrome.tabs.onUpdated.addListener(changeIcon)
