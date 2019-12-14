<template>
  <div
    class="labyrinth-container"
    :style="{ backgroundColor: this.theme.background }">
    <svg
      v-if="this.level.path"
      @mousedown="onMousedown"
      @mouseup="onMouseup"
      @mouseleave="onMouseleave"
      @mouseout="onMouseout"
      @mousemove="onMousemove">
      <g
        class="path-container"
        :transform="pathContainerTransform">
        <path
          class="outline"
          :stroke="this.theme.border"
          :stroke-width="this.theme.borderWidth + 24 || 28"
          fill="none"
          :d="this.level.path"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
        <path
          class="outline"
          :stroke="this.theme.fullPath"
          stroke-width="24"
          fill="none"
          :d="this.level.path"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
        <path
          id="animated-path"
          class="animated-path"
          :style="animatedPathStyles"
          :d="this.level.path"
          :stroke="this.theme.playerPath"
          stroke-width="16"
          fill="none"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
      </g>
      <g>
        <circle
          class="position"
          :cx="this.windowWidth / 2"
          :cy="this.windowHeight / 2"
          r="20"
          :fill="this.theme.player" />
      </g>
      <g v-if="debugMode">
        <path
          :d="debugHeading"
          stroke="#ff6063"
          stroke-width="4"
          fill="none" />
        <path
          :d="debugTouchDirection"
          stroke="#a991e8"
          stroke-width="4"
          fill="none" />
      </g>
    </svg>
    <span v-if="finished">Done!</span>
    <!-- <button id="button" @click="transition">Restart</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { bind, throttle } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import store from '../store'

type Point = {
  x: number
  y: number
}

@Component({
  computed: {
    ...mapGetters({
      level: 'getCurrentLevel',
      theme: 'getRandomTheme'
    }),
    ...mapState('movement', {
      animatedPathStyles: 'animatedPathStyles',
      circlePositionWithinLabyrinth: 'circlePositionWithinLabyrinth',
      currentHeading: 'currentHeading',
      currentSpeed: 'currentSpeed',
      currentTouchDirection: 'currentTouchDirection',
      debugHeading: 'debugHeading',
      debugMode: 'debugMode',
      debugTouchDirection: 'debugTouchDirection',
      finished: 'finished',
      lastPassedPoint: 'lastPassedPoint',
      moving: 'moving',
      pathContainerTransform: 'pathContainerTransform',
      pathElement: 'pathElement',
      pathLength: 'pathLength',
      position: 'position',
      started: 'started'
    })
  }
})

export default class Labyrinth extends Vue {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight

  DURATION_MULTIPLIER: number = 10

  animate() {
    if (this.position >= this.pathLength) {
      store.commit('movement/setMoving', false)
      this.advanceToNextLevel()
    } else {
      if (this.moving) {
        store.commit('movement/setPosition', this.position + 3 * this.currentSpeed)
        this.setStyles()
        this.getContainerPosition()
        window.requestAnimationFrame(this.animate)
      }
    }
  }

  advanceToNextLevel() {
    console.warn('complete!')

    // @ts-ignore
    document.getElementById('animated-path').removeEventListener('animationend', this.onAnimationEnd, false)

    this.beginLevel()
  }

  beginAnimation() {
    store.commit('movement/setStarted', true)
    store.commit('movement/setMoving', true)

    this.animate()
  }

  endAnimation() {
    store.commit('movement/setMoving', false)
  }

  setStyles() {
    // @ts-ignore
    store.commit('movement/setCirclePositionWithinLabyrinth', this.pathElement.getPointAtLength(this.position))

    const animatedPathStyles = `
      display: ${this.started ? 'initial' : 'none'};
      --path-length: ${this.pathLength};
      stroke-dashoffset: ${this.pathLength - this.position};
    `
    store.commit('movement/setAnimatedPathStyles', animatedPathStyles)

    if (this.circlePositionWithinLabyrinth) {
      const pathContainerTransform = `translate(-${this.circlePositionWithinLabyrinth.x},-${this.circlePositionWithinLabyrinth.y})`
      store.commit('movement/setPathContainerTransform', pathContainerTransform)
    }
  }

  /**
   * Calculates the direction the circle is "moving" along the line, where 0 is up, 90 is right, etc.
   * Also used to calculate the position of the cursor/finger relative to the circle
   */
  calculateHeading(firstX: number, firstY: number, secondX: number, secondY: number): number {
    const radians = Math.atan2(firstX - secondX, secondY - firstY)
    const degrees = radians * (180 / Math.PI)
    return degrees < 0 ? 360 + degrees : degrees
  }

  getContainerPosition(): void {
    // NOTE: needs to be called after setStyles() so circlePositionWithinLabyrinth will be set
    if(this.moving && this.circlePositionWithinLabyrinth) {
      const rect = this.circlePositionWithinLabyrinth
      if (this.lastPassedPoint) {
        let debugHeading = `M ${this.windowWidth / 2},${this.windowHeight / 2} l ${(rect.x - this.lastPassedPoint.x) * 100},${(rect.y - this.lastPassedPoint.y) * 100}`
        store.commit('movement/setDebugHeading', debugHeading)

        const distanceBetweenCurrentAndLast = Math.hypot(rect.x - this.lastPassedPoint.x, rect.y - this.lastPassedPoint.y)
        if (distanceBetweenCurrentAndLast > 1) {
          const currentHeading = this.calculateHeading(this.lastPassedPoint.x, this.lastPassedPoint.y, rect.x, rect.y)
          store.commit('movement/setCurrentHeading', currentHeading)

          this.calculateSpeed()
          store.commit('movement/setLastPassedPoint', this.circlePositionWithinLabyrinth)
        }
      } else {
        store.commit('movement/setCurrentSpeed', 1)
        store.commit('movement/setLastPassedPoint', this.circlePositionWithinLabyrinth)
      }
    }
  }

  onTouchstart(): void {
    this.beginAnimation()
  }

  onMousedown(): void {
    this.beginAnimation()
  }

  onTouchend(): void {
    this.endAnimation()
  }

  onMouseup(): void {
    this.endAnimation()
  }

  onMouseout() {}

  onMouseleave() {}

  // @ts-ignore
  onTouchmove(e) {
    // @ts-ignore
    e.preventDefault()
    // TODO: might need to throttle this? it sounds like chrome may throttle to 200ms by default
    this.getCurrentTouchDirection(e.touches[0].pageX, e.touches[0].pageY)
  }

  onMousemove = bind(throttle(e => this.getCurrentTouchDirection(e.x, e.y), 50, {
    leading: true
  }), this)

  calculateSpeed(): void {
    if (typeof this.currentHeading === 'number' && typeof this.currentTouchDirection === 'number') {
      const inverseSpeed = Math.abs(this.currentHeading - this.currentTouchDirection) // 0 to 180

      store.commit('movement/setCurrentSpeed', Math.max(90 - inverseSpeed, 0) / 90) // 0 to 1
    }
  }

  getCurrentTouchDirection(x: number, y: number): void {
    // TODO: probably should also call this on mousedown
    // TODO: can probably store position of circle: it shouldn't change
    const circle = document.querySelector('.position')
    if (circle) { // FIXME: how is there ever not a circle? 🤔
      const circleRect = circle.getBoundingClientRect()
      const circlePosition: Point = {
        x: circleRect.left + (circleRect.width / 2),
        y: circleRect.top + (circleRect.height / 2)
      }

      const currentTouchDirection = this.calculateHeading(circlePosition.x, circlePosition.y, x, y)
      store.commit('movement/setCurrentTouchDirection', currentTouchDirection)

      const debugTouchDirection = `M ${this.windowWidth / 2},${this.windowHeight / 2} l ${x - circlePosition.x},${y - circlePosition.y}`
      store.commit('movement/setDebugTouchDirection', debugTouchDirection)

      this.calculateSpeed()
    }
  }

  // @ts-ignore
  onAnimationEnd(e) {
    // @ts-ignore
    if (e.type === 'animationend') {
      store.commit('movement/setFinished', true)
      store.commit('movement/setLastPassedPoint', null)
      store.commit('movement/setCurrentHeading', null)
      store.commit('movement/setCurrentTouchDirection', null)
      store.commit('movement/setCurrentSpeed', 1)
    }
  }

  onWindowResize(): void {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
  }

  setupLevel() {
    if (process.env.NODE_ENV === 'development') {
      store.commit('movement/setDebugMode', true)
    }

    // TODO: refactor this with onAnimationEnd (some repeats)
    store.commit('movement/setPosition', 0)
    store.commit('movement/setMoving', false)
    store.commit('movement/setStarted', false)
    store.commit('movement/setFinished', false)
    store.commit('movement/setLastPassedPoint', null)
    store.commit('movement/setCurrentHeading', null)
    store.commit('movement/setCurrentTouchDirection', null)

    // @ts-ignore
    store.commit('movement/setPathElement', document.getElementById('animated-path'))
    // @ts-ignore
    store.commit('movement/setPathLength', this.pathElement.getTotalLength())

    // @ts-ignore
    this.pathElement.addEventListener('animationend', this.onAnimationEnd, false)

    this.setStyles()
  }

  beginLevel() {
    store.commit('setCurrentLevel')

    setTimeout(bind(function(){
    // wait for svg to paint the new level
    // TODO: make this longer (just in case) and do some animation or something to hide it
    // @ts-ignore
      this.setupLevel()
    }, this), 100)
  }

  mounted() {
    document.body.addEventListener('touchstart', this.onTouchstart, false)
    document.body.addEventListener('touchmove', this.onTouchmove, {
      passive: false
    })
    document.body.addEventListener('touchend', this.onTouchend, false)
    window.addEventListener('resize', this.onWindowResize)

    this.beginLevel()
  }

  beforeDestroy() {
    document.body.removeEventListener('touchstart', this.onTouchstart)
    document.body.removeEventListener('touchmove', this.onTouchmove)
    document.body.removeEventListener('touchend', this.onTouchend)
    window.removeEventListener('resize', this.onWindowResize)
    // @ts-ignore
    document.querySelector('.animated-path').removeEventListener('animationend', this.onAnimationEnd, false)
  }
}
</script>

<style scoped lang="scss">
.labyrinth-container, svg {
  width: 100%;
  height: 100%;
}

.animated-path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
}

.path-container {
  offset-rotate: 0deg;
}
</style>
