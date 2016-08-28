import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
    apiKey: "AIzaSyCF61pRrZ9ZdAl2aHUSJvBOv9SIhovtaUc",
    authDomain: "based-marks.firebaseapp.com",
    databaseURL: "https://based-marks.firebaseio.com",
    storageBucket: "based-marks.appspot.com",
}
firebase.initializeApp(config)

const STORE = {
    bookmarks: {},
    user: {},
    init () {
        if (!localStorage['bookmarks']) return

        this.bookmarks = JSON.parse(localStorage['bookmarks'])
    },
    getBookmark (url) {
        for (let key of Object.keys(this.bookmarks)) {
            const val = this.bookmarks[key]
            if (val.url === url) return [key, val]
        }
        return [undefined, undefined]
    }
}

window.onstorage = function (e) {
    const key = e.key
    if (key === 'bookmarks') {
        const newVal = e.newValue
        STORE.bookmarks = newVal ? newVal : {}
    }
}

firebase.auth().onAuthStateChanged(user => {
    STORE.user = user ? user : {}
})

export default STORE
