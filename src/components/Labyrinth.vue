<template>
  <div
    class="labyrinth-container">
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
          stroke="#B58A47"
          stroke-width="28"
          fill="none"
          :d="pathD"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
        <path
          class="outline"
          stroke="#546e7a"
          stroke-width="24"
          fill="none"
          :d="pathD"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
        <path
          id="animated-path"
          class="animated-path"
          :style="animatedPathStyles"
          :d="pathD"
          stroke="#B58A47"
          stroke-width="16"
          fill="none"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
      </g>
      <g>
        <circle
          class="position"
          :cx="this.windowWidth / 2"
          :cy="this.windowHeight / 2"
          r="16"
          fill="#FFCD7D" />
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

type Point = {
  x: number
  y: number
}

@Component
export default class Labyrinth extends Vue {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  // pathD: string = 'M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128'
  // pathD: string = 'm81.5,177.453125c24,-68 54,-11 53.5,-11.453125c0.5,0.453125 75.5,-38.546875 75,-39c0.5,0.453125 58.5,35.453125 7.5,81.453125c-51,46 -78,82 -108,48c-30,-34 -29,-149 9,-166c38,-17 86,79 77,94c-9,15 -39,117 14,102c53,-15 105,-74 74,-93c-31,-19 37,-13 36.5,-13.453125c0.5,0.453125 82.5,51.453125 82,51c0.5,0.453125 56.5,96.453125 -47.5,83.453125c-104,-13 -176,-86 -94,-133c82,-47 -24,-79 -24,-79c0,0 -66,-49 -66.5,-49.453125'
  // pathD: string = 'A 30.452 30.452 0 1 0 50.819 108.959 A 112.145 112.145 0 0 1 43.776 184.373 A 88.036 88.036 0 0 0 110.322 308.719 A 56.629 56.629 0 0 0 165.385 220.519 A 42.422 42.422 0 0 0 90.266 231.177 A 21.548000000000002 21.548000000000002 0 1 1 65.497 203.234 A 316.903 316.903 0 0 1 140.087 196.942 A 78.617 78.617 0 0 0 179.867 187.689 A 19.635 19.635 0 1 0 150.974 170.824 A 18.055 18.055 0 1 1 120.591 158.047 A 81.875 81.875 0 0 0 70.157 16.558 A 57.009 57.009 0 0 0 25.563 113.286 A 24.631 24.631 0 0 1 21.449 151.104 A 26.21 26.21 0 0 0 10.639 180.318 A 76.971 76.971 0 0 0 132.69 218.979 A 48.536 48.536 0 0 1 201.226 226.912'
  pathD: string = 'M 16 23.926 C 16 -9.578 122.928 59.758 144 71.926 L 528 295.926 C 549.072 308.094 656 377.43 656 343.926 C 655.912 245.398 549.192 184.054 463.904 233.286 C 424.32 256.126 399.96 298.302 400 343.926 C 400 377.43 506.928 308.094 528 295.926 L 912 71.926 C 933.072 59.758 1040 -9.578 1040 23.926 C 1039.912 122.454 933.192 183.798 847.904 134.566 C 808.32 111.726 783.96 69.55 784 23.926 C 784 -9.578 890.928 59.758 912 71.926 L 1296 295.926 C 1317.072 308.094 1424 377.43 1424 343.926 C 1423.912 245.398 1317.192 184.054 1231.904 233.286 C 1192.32 256.126 1167.96 298.302 1168 343.926 C 1168 377.43 1274.928 308.094 1296 295.926 C 1301.648 292.646 1424 215.926 1424 183.926 C 1424 151.926 1296 71.926 1296 71.926 C 1274.928 59.758 1168 -9.578 1168 23.926 C 1168.088 122.454 1274.808 183.798 1360.096 134.566 C 1399.68 111.726 1424.04 69.55 1424 23.926 C 1424 -9.578 1317.072 59.758 1296 71.926 L 912 295.926 C 890.928 308.094 784 377.43 784 343.926 C 784.088 245.398 890.808 184.054 976.096 233.286 C 1015.68 256.126 1040.04 298.302 1040 343.926 C 1040 377.43 933.072 308.094 912 295.926 L 528 71.926 C 506.928 59.758 400 -9.578 400 23.926 C 400.088 122.454 506.808 183.798 592.096 134.566 C 631.68 111.726 656.04 69.55 656 23.926 C 656 -9.578 549.072 59.758 528 71.926 L 144 295.926 C 122.928 308.094 16 377.43 16 343.926 C 16.088 245.398 122.808 184.054 208.096 233.286 C 247.68 256.126 272.04 298.302 272 343.926 C 272 377.43 165.072 308.094 144 295.926 C 138.352 292.646 16 215.926 16 183.926 C 16 151.926 144 71.926 144 71.926 C 165.072 59.758 272 -9.578 272 23.926 C 271.912 122.454 165.192 183.798 79.904 134.566 C 40.32 111.726 15.96 69.55 16 23.926'
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
      this.debugMode = true
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
