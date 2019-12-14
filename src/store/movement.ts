import { bind } from 'lodash'
import Vue from 'vue'
import Vuex, { MutationTree } from 'vuex'
import { MovementStoreState, Point } from './types'

Vue.use(Vuex)

const SPEED_MULTIPLIER = 3
const WAYPOINT_DISTANCE = 5 // how far ahead the waypoint is of the current player position, in pathLength units

/**
 * Calculates the direction the circle is "moving" along the line, where 0 is up, 90 is right, etc.
 * Also used to calculate the position of the cursor/finger relative to the circle
 */
// const calculateHeading: number = (firstX: number, firstY: number, secondX: number, secondY: number) => {
const calculateHeading = (firstX: number, firstY: number, secondX: number, secondY: number) => {
  const radians = Math.atan2(firstX - secondX, secondY - firstY)
  const degrees = radians * (180 / Math.PI)
  return degrees < 0 ? 360 + degrees : degrees
}

const movementStoreState: MovementStoreState = {
  animatedPathStyles: '',
  circlePositionWithinLabyrinth: null,
  currentHeading: null,
  currentSpeed: 1,
  currentTouchDirection: null,
  debugHeading: '',
  debugMode: false,
  debugTouchDirection: '',
  finished: false,
  moving: false,
  pathContainerTransform: '',
  pathElement: null,
  pathLength: 0,
  position: 0,
  started: false,
  waypoint: {x: 0, y: 0},
  windowHeight: 0,
  windowWidth: 0
}

export const mutations: MutationTree<MovementStoreState> = {
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
  },
  setWaypoint(state, payload) {
    state.waypoint = payload
  },
  setWindowSize(state, payload) {
    state.windowWidth = payload.width
    state.windowHeight = payload.height
  }
}

export const actions = {
  advanceToNextLevel({ commit, dispatch, state }: any) {
    console.warn('complete!')
    commit('setMoving', false)

    // @ts-ignore
    document.getElementById('animated-path').removeEventListener('animationend', state.onAnimationEnd, false)

    dispatch('beginLevel')
  },
  /**
   * this method is recursive via window.requestAnimationFrame
   * don't add anything to it unless it should get recursed
   */
  animate({ commit, dispatch, state }: any) {
    const recurse = () => {
      dispatch('animate')
    }

    if (state.position >= state.pathLength) {
      dispatch('advanceToNextLevel')
    } else {
      if (state.moving) {
        commit('setPosition', state.position + SPEED_MULTIPLIER * state.currentSpeed)
        dispatch('setStyles')
        dispatch('calculateWaypoint')
        window.requestAnimationFrame(recurse)
      }
    }
  },
  beginAnimation({ commit, dispatch }: any) {
    commit('setStarted', true)
    commit('setMoving', true)

    dispatch('animate')
  },
  beginLevel({ commit, dispatch }: any) {
    commit('setCurrentLevel', null, { root: true })

    setTimeout(bind(function() {
      // wait for svg to paint the new level
      // TODO: make this longer (just in case) and do some animation or something to hide it
      dispatch('setupLevel')
    }, this), 100)
  },
  calculateSpeed({ commit, state }: any) {
    // FIXME: state.currentHeading is always null
    if (typeof state.currentHeading === 'number' && typeof state.currentTouchDirection === 'number') {
      const inverseSpeed = Math.abs(state.currentHeading - state.currentTouchDirection) // 0 to 180

      commit('setCurrentSpeed', Math.max(90 - inverseSpeed, 0) / 90) // 0 to 1
    }
  },
  /**
   * finds a waypoint WAYPOINT_DISTANCE ahead of the player's position and sets the heading based on it
   */
  calculateWaypoint({ commit, dispatch, state }: any) {
    // NOTE: needs to be called after setStyles() so circlePositionWithinLabyrinth will be set
    if (state.moving && state.circlePositionWithinLabyrinth) {
      const rect = state.circlePositionWithinLabyrinth
      const waypoint = state.pathElement.getPointAtLength(state.position + WAYPOINT_DISTANCE)
      commit('setWaypoint', waypoint)
      const debugHeading = `M ${state.windowWidth / 2},${state.windowHeight / 2} l ${(waypoint.x - rect.x) * 10},${(waypoint.y - rect.y) * 10}`
      commit('setDebugHeading', debugHeading)

      const currentHeading = calculateHeading(rect.x, rect.y, waypoint.x, waypoint.y)
      commit('setCurrentHeading', currentHeading)

      dispatch('calculateSpeed')
    } else {
      commit('setCurrentSpeed', 1)
    }
  },
  getCurrentTouchDirection({ commit, dispatch, state }: any, touchPosition: Point) {
    // TODO: probably should also call this on mousedown
    // TODO: can probably store position of circle: it shouldn't change
    const circle = document.querySelector('.position')
    if (circle) { // FIXME: how is there ever not a circle? 🤔
      const circleRect = circle.getBoundingClientRect()
      const circlePosition: Point = {
        x: circleRect.left + (circleRect.width / 2),
        y: circleRect.top + (circleRect.height / 2)
      }

      const currentTouchDirection = calculateHeading(circlePosition.x, circlePosition.y, touchPosition.x, touchPosition.y)
      commit('setCurrentTouchDirection', currentTouchDirection)

      const debugTouchDirection = `M ${state.windowWidth / 2},${state.windowHeight / 2} l ${touchPosition.x - circlePosition.x},${touchPosition.y - circlePosition.y}`
      commit('setDebugTouchDirection', debugTouchDirection)

      dispatch('calculateSpeed')
    }
  },
  endAnimation({ commit }: any) {
    commit('setMoving', false)
  },
  setStyles({ commit, state }: any) {
    // @ts-ignore
    commit('setCirclePositionWithinLabyrinth', state.pathElement.getPointAtLength(state.position))

    const animatedPathStyles = `
      display: ${state.started ? 'initial' : 'none'};
      --path-length: ${state.pathLength};
      stroke-dashoffset: ${state.pathLength - state.position};
    `
    commit('setAnimatedPathStyles', animatedPathStyles)

    if (state.circlePositionWithinLabyrinth) {
      const pathContainerTransform = `translate(-${state.circlePositionWithinLabyrinth.x},-${state.circlePositionWithinLabyrinth.y})`
      commit('setPathContainerTransform', pathContainerTransform)
    }
  },
  setupLevel({ commit, dispatch, state }: any) {
    if (process.env.NODE_ENV === 'development') {
      commit('setDebugMode', true)
    }

    commit('setPosition', 0)
    commit('setMoving', false)
    commit('setStarted', false)
    dispatch('stopMovement')

    // @ts-ignore
    commit('setPathElement', document.getElementById('animated-path'))
    // @ts-ignore
    commit('setPathLength', state.pathElement.getTotalLength())

    // @ts-ignore
    state.pathElement.addEventListener('animationend', state.onAnimationEnd, false)

    dispatch('setStyles')
  },
  stopMovement({ commit }: any) {
    commit('setFinished', true)
    commit('setCurrentHeading', null)
    commit('setCurrentTouchDirection', null)
    commit('setCurrentSpeed', 1)
  }
}

export default {
  namespaced: true,
  state: movementStoreState,
  getters: {
  },
  mutations,
  actions,
  modules: {
  }
}
