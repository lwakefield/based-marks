import STORE from './Store.js'
STORE.init()

chrome.tabs.query({active: true}, tabs => {
    const tab = tabs[0]
    const url = tab.url
    const title = tab.title

    const [key, bookmark] = STORE.getBookmark(url)
    if (bookmark)
        return
    else
        return
})

