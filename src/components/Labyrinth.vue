<template>
  <div
    class="labyrinth-container"
    :style="{ backgroundColor: this.theme.background }">
    <svg
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
import { mapGetters } from 'vuex'
import store from '../store'

type Point = {
  x: number
  y: number
}

@Component({
  computed: {
    ...mapGetters({
      level: 'getRandomLevel',
      theme: 'getRandomTheme'
    })
  }
})

export default class Labyrinth extends Vue {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  pathElement: Element | null = null
  debugHeading: string = ''
  debugTouchDirection: string = ''
  debugMode: boolean = false

  moving: boolean = false
  pathLength: number = 0
  position: number = 0
  DURATION_MULTIPLIER: number = 10
  currentSpeed: number = 1
  started: boolean = false
  finished: boolean = false
  circlePositionWithinLabyrinth: DOMPoint | null = null
  lastPassedPoint: DOMPoint | null = null
  currentHeading: number | null = null
  currentTouchDirection: number | null = null

  animatedPathStyles: string = ''
  pathContainerTransform: string = ''

  touchPointInterval: number = 0

  animate() {
    if (this.position >= this.pathLength) {
      this.moving = false
      console.warn('complete!')

    } else {
      if (this.moving) {
        this.position += 3 * this.currentSpeed
        this.setStyles()
        this.getContainerPosition()
        window.requestAnimationFrame(this.animate)
      }
    }
  }

  beginAnimation() {
    this.started = true
    this.moving = true

    this.animate()
  }

  endAnimation() {
    this.moving = false
    window.clearInterval(this.touchPointInterval)
  }

  setStyles() {
    // @ts-ignore
    this.circlePositionWithinLabyrinth = this.pathElement.getPointAtLength(this.position)

    this.animatedPathStyles = `
      display: ${this.started ? 'initial' : 'none'};
      --path-length: ${this.pathLength};
      stroke-dashoffset: ${this.pathLength - this.position};
    `

    if (this.circlePositionWithinLabyrinth) {
      this.pathContainerTransform = `translate(-${this.circlePositionWithinLabyrinth.x},-${this.circlePositionWithinLabyrinth.y})`
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
        this.debugHeading = `M ${this.windowWidth / 2},${this.windowHeight / 2} l ${(rect.x - this.lastPassedPoint.x) * 100},${(rect.y - this.lastPassedPoint.y) * 100}`
        const distanceBetweenCurrentAndLast = Math.hypot(rect.x - this.lastPassedPoint.x, rect.y - this.lastPassedPoint.y)
        if (distanceBetweenCurrentAndLast > 1) {
          this.currentHeading = this.calculateHeading(this.lastPassedPoint.x, this.lastPassedPoint.y, rect.x, rect.y)
          this.calculateSpeed()
          this.lastPassedPoint = this.circlePositionWithinLabyrinth
        }
      } else {
        this.currentSpeed = 1
        this.lastPassedPoint = this.circlePositionWithinLabyrinth
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
      this.currentSpeed = Math.max(90 - inverseSpeed, 0) / 90 // 0 to 1
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
      this.currentTouchDirection = this.calculateHeading(circlePosition.x, circlePosition.y, x, y)

      this.debugTouchDirection = `M ${this.windowWidth / 2},${this.windowHeight / 2} l ${x - circlePosition.x},${y - circlePosition.y}`
      this.calculateSpeed()
    }
  }

  // @ts-ignore
  onAnimationEnd(e) {
    // @ts-ignore
    if (e.type === 'animationend') {
      this.finished = true
      this.lastPassedPoint = null
      this.currentHeading = null
      this.currentTouchDirection = null
      this.currentSpeed = 1
    }
  }

  onWindowResize(): void {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
  }

  mounted() {
    if (process.env.NODE_ENV === 'development') {
      // this.debugMode = true
    }

    // TODO: some of this should possibly move into a startingLevel method
    this.pathElement = document.querySelector('.animated-path')
    if (this.pathElement) {
    // @ts-ignore
      this.pathLength = this.pathElement.getTotalLength()
    }

    document.body.addEventListener('touchstart', this.onTouchstart, false)
    document.body.addEventListener('touchmove', this.onTouchmove, {
      passive: false
    })
    document.body.addEventListener('touchend', this.onTouchend, false)
    window.addEventListener('resize', this.onWindowResize)

    // @ts-ignore
    document.querySelector('.animated-path').addEventListener('animationend', this.onAnimationEnd, false)

    this.setStyles()
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
