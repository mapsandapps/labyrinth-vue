import { random } from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import movement from './movement'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    movement
  },
  state: {
    currentLevel: {},
    currentLevelIndex: 0,
    gameMode: 'random',
    levels: [
      {
        path: 'M 127.515 95.516 C 127.515 47.516 180.926 15.482 223.569 39.929 C 243.561 51.389 255.768 72.633 255.511 95.516 L 255.515 351.516 C 255.515 399.516 308.926 431.55 351.569 407.103 C 371.561 395.643 383.768 374.399 383.511 351.516 L 383.515 95.516 L 127.515 95.516 C 79.516 95.516 47.482 148.927 71.929 191.57 C 83.389 211.562 104.633 223.769 127.516 223.512 L 383.515 223.516 C 431.515 223.516 463.549 276.927 439.102 319.57 C 427.642 339.562 406.398 351.769 383.515 351.512 L 127.515 351.516 L 127.516 95.516'
      },
      {
        path: 'M 16 23.926 C 16 -9.578 122.928 59.758 144 71.926 L 528 295.926 C 549.072 308.094 656 377.43 656 343.926 C 655.912 245.398 549.192 184.054 463.904 233.286 C 424.32 256.126 399.96 298.302 400 343.926 C 400 377.43 506.928 308.094 528 295.926 L 912 71.926 C 933.072 59.758 1040 -9.578 1040 23.926 C 1039.912 122.454 933.192 183.798 847.904 134.566 C 808.32 111.726 783.96 69.55 784 23.926 C 784 -9.578 890.928 59.758 912 71.926 L 1296 295.926 C 1317.072 308.094 1424 377.43 1424 343.926 C 1423.912 245.398 1317.192 184.054 1231.904 233.286 C 1192.32 256.126 1167.96 298.302 1168 343.926 C 1168 377.43 1274.928 308.094 1296 295.926 C 1301.648 292.646 1424 215.926 1424 183.926 C 1424 151.926 1296 71.926 1296 71.926 C 1274.928 59.758 1168 -9.578 1168 23.926 C 1168.088 122.454 1274.808 183.798 1360.096 134.566 C 1399.68 111.726 1424.04 69.55 1424 23.926 C 1424 -9.578 1317.072 59.758 1296 71.926 L 912 295.926 C 890.928 308.094 784 377.43 784 343.926 C 784.088 245.398 890.808 184.054 976.096 233.286 C 1015.68 256.126 1040.04 298.302 1040 343.926 C 1040 377.43 933.072 308.094 912 295.926 L 528 71.926 C 506.928 59.758 400 -9.578 400 23.926 C 400.088 122.454 506.808 183.798 592.096 134.566 C 631.68 111.726 656.04 69.55 656 23.926 C 656 -9.578 549.072 59.758 528 71.926 L 144 295.926 C 122.928 308.094 16 377.43 16 343.926 C 16.088 245.398 122.808 184.054 208.096 233.286 C 247.68 256.126 272.04 298.302 272 343.926 C 272 377.43 165.072 308.094 144 295.926 C 138.352 292.646 16 215.926 16 183.926 C 16 151.926 144 71.926 144 71.926 C 165.072 59.758 272 -9.578 272 23.926 C 271.912 122.454 165.192 183.798 79.904 134.566 C 40.32 111.726 15.96 69.55 16 23.926'
      },
      {
        path: 'M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128'
      },
      {
        path: 'm81.5,177.453125c24,-68 54,-11 53.5,-11.453125c0.5,0.453125 75.5,-38.546875 75,-39c0.5,0.453125 58.5,35.453125 7.5,81.453125c-51,46 -78,82 -108,48c-30,-34 -29,-149 9,-166c38,-17 86,79 77,94c-9,15 -39,117 14,102c53,-15 105,-74 74,-93c-31,-19 37,-13 36.5,-13.453125c0.5,0.453125 82.5,51.453125 82,51c0.5,0.453125 56.5,96.453125 -47.5,83.453125c-104,-13 -176,-86 -94,-133c82,-47 -24,-79 -24,-79c0,0 -66,-49 -66.5,-49.453125'
      },
      {
        path: 'M 800,300 a 100,100 0 0,0 -200,0 a 100,100 0 0,0 -200,0 a 200,200 0 0,0 500,0 a 200,200 0 0,0 -300,-150 a 200,200 0 0,0 -300,150 a 200,200 0 0,0 500,0'
      }
    ],
    // {
    //   player: '',
    //   playerPath: '',
    //   fullPath: '',
    //   background: '',
    //   border: ''
    // },
    themes: [
      {
        player: '#ffcd7d',
        playerPath: '#b58a47',
        fullPath: '#546e7a',
        background: 'white',
        border: '#b58a47'
      },
      { // https://www.happyhues.co/palettes/4
        player: '#2cb67d',
        playerPath: '#7f5af0',
        fullPath: '#fffffe',
        background: '#fffffe',
        border: '#010101',
        borderWidth: 8
      },
      { // https://www.happyhues.co/palettes/13
        player: '#e53170',
        playerPath: '#ff8906',
        fullPath: '#fffffe',
        background: '#fffffe',
        border: 'black',
        borderWidth: 8
      },
      { // https://www.happyhues.co/palettes/10
        player: '#f9bc60',
        playerPath: '#abd1c6',
        fullPath: '#004643',
        background: '#004643',
        border: '#abd1c6',
        borderWidth: 8
      },
      { // corn snake
        player: '#d97322',
        playerPath: '#eab264',
        fullPath: '#5d1602',
        background: '#e9d2aa',
        border: '#ab2203'
      },
      { // https://www.pantone.com/color-intelligence/color-of-the-year/color-of-the-year-2020-palette-exploration
        player: '#34538a',
        playerPath: '#34538a',
        fullPath: '#f4dbb2',
        background: '#b4c6d6',
        border: '#34538a'
      },
      {
        player: 'rgb(43, 170, 207)',
        playerPath: 'rgb(43, 170, 207)',
        fullPath: 'rgb(239, 240, 225)',
        background: 'white',
        border: 'rgb(239, 240, 225)'
      }
    ]
  },
  getters: {
    getAllLevels: state => {
      return state.levels
    },
    getCurrentLevel: state => {
      return state.currentLevel
    },
    getRandomTheme: state => {
      return state.themes[random(state.themes.length - 1)]
    }
  },
  mutations: {
    setCurrentLevel(state, payload) {
      state.gameMode = 'linear'
      if (payload < state.levels.length) {
        state.currentLevelIndex = payload
      } else {
        console.warn('finished levels! looping back to beginning')
        state.currentLevelIndex = 0
      }
      state.currentLevel = state.levels[state.currentLevelIndex]
    },
    setRandomLevel(state) {
      state.gameMode = 'random'
      const levelIndex = random(state.levels.length - 1)
      state.currentLevelIndex = levelIndex
      state.currentLevel = state.levels[levelIndex]
    }
  },
  actions: {
  }
})
