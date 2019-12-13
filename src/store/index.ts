import { random } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
      }
    ]
  },
  getters: {
    getRandomTheme: state => {
      return state.themes[random(state.themes.length - 1)]
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
