import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// TODO: types
export default {
  namespaced: true,
  state: {
    animatedPathStyles: '', // string
    circlePositionWithinLabyrinth: null, // DOMPoint | null
    currentHeading: null, // number | null
    currentSpeed: 1, // number
    currentTouchDirection: null, // number | null
    debugHeading: '', // string
    debugMode: false,
    debugTouchDirection: '', // string
    finished: false,
    lastPassedPoint: null, // DOMPoint | null
    moving: false,
    pathContainerTransform: '', // string
    pathElement: null, // Element | null
    pathLength: 0, // number
    position: 0, // number
    started: false
  },
  getters: {
  },
  mutations: {
    setAnimatedPathStyles(state, payload) {
      state.animatedPathStyles = payload
    },
    setCirclePositionWithinLabyrinth(state, payload) {
      state.circlePositionWithinLabyrinth = payload
    },
    setCurrentHeading(state, payload) {
      state.currentHeading = payload
    },
    setCurrentSpeed(state, payload) {
      state.currentSpeed = payload
    },
    setCurrentTouchDirection(state, payload) {
      state.currentTouchDirection = payload
    },
    setDebugHeading(state, payload) {
      state.debugHeading = payload
    },
    setDebugMode(state, payload) {
      state.debugMode = payload
    },
    setDebugTouchDirection(state, payload) {
      state.debugTouchDirection = payload
    },
    setFinished(state, payload) {
      state.finished = payload
    },
    setLastPassedPoint(state, payload) {
      state.lastPassedPoint = payload
    },
    setMoving(state, payload) {
      state.moving = payload
    },
    setPathContainerTransform(state, payload) {
      state.pathContainerTransform = payload
    },
    setPathElement(state, payload) {
      state.pathElement = payload
    },
    setPathLength(state, payload) {
      state.pathLength = payload
    },
    setPosition(state, payload) {
      state.position = payload
    },
    setStarted(state, payload) {
      state.started = payload
    }
  },
  actions: {
  },
  modules: {
  }
}
