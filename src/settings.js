import Vue from 'vue'
import STORE from './Store.js'

STORE.init()

const vm = new Vue({
    el: '#app',
    data: {
        msg: 'hello world',
        STORE
    }
})

