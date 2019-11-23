<template>
  <div
    class="labyrinth-container">
    <svg
      viewBox="0 0 500 500"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mouseleave="mouseleave"
      @mouseout="mouseout"
      @mousemove="mousemove">
      <g
        class="path-container"
        :style="pathContainerStyles"
        :transform="pathContainerTransform">
        <path
          class="outline"
          stroke="#B58A47"
          stroke-width="14"
          fill="none"
          :d="pathD" />
        <path
          class="outline"
          stroke="#546e7a"
          stroke-width="12"
          fill="none"
          :d="pathD" />
        <path
          class="animated-path"
          :style="animatedPathStyles"
          :d="pathD"
          stroke="#B58A47"
          stroke-width="8"
          fill="none" />
      </g>
      <g>
        <circle
          cx="250"
          cy="250"
          r="8"
          fill="#FFCD7D" />
          <!-- TODO: give circle a shadow -->
      </g>
    </svg>
    <span v-if="finished">Done!</span>
    <!-- <button id="button" @click="transition">Restart</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Labyrinth extends Vue {
  // pathD: string = 'M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128'
  // pathD: string = 'm81.5,177.453125c24,-68 54,-11 53.5,-11.453125c0.5,0.453125 75.5,-38.546875 75,-39c0.5,0.453125 58.5,35.453125 7.5,81.453125c-51,46 -78,82 -108,48c-30,-34 -29,-149 9,-166c38,-17 86,79 77,94c-9,15 -39,117 14,102c53,-15 105,-74 74,-93c-31,-19 37,-13 36.5,-13.453125c0.5,0.453125 82.5,51.453125 82,51c0.5,0.453125 56.5,96.453125 -47.5,83.453125c-104,-13 -176,-86 -94,-133c82,-47 -24,-79 -24,-79c0,0 -66,-49 -66.5,-49.453125'
  // pathD: string = 'A 30.452 30.452 0 1 0 50.819 108.959 A 112.145 112.145 0 0 1 43.776 184.373 A 88.036 88.036 0 0 0 110.322 308.719 A 56.629 56.629 0 0 0 165.385 220.519 A 42.422 42.422 0 0 0 90.266 231.177 A 21.548000000000002 21.548000000000002 0 1 1 65.497 203.234 A 316.903 316.903 0 0 1 140.087 196.942 A 78.617 78.617 0 0 0 179.867 187.689 A 19.635 19.635 0 1 0 150.974 170.824 A 18.055 18.055 0 1 1 120.591 158.047 A 81.875 81.875 0 0 0 70.157 16.558 A 57.009 57.009 0 0 0 25.563 113.286 A 24.631 24.631 0 0 1 21.449 151.104 A 26.21 26.21 0 0 0 10.639 180.318 A 76.971 76.971 0 0 0 132.69 218.979 A 48.536 48.536 0 0 1 201.226 226.912'
  pathD: string = 'M 16 19.397 C 16 2.645 69.464 37.313 80 43.397 L 272 155.397 C 282.536 161.481 336 196.149 336 179.397 C 335.956 130.133 282.596 99.461 239.952 124.077 C 220.16 135.497 207.98 156.585 208 179.397 C 208 196.149 261.464 161.481 272 155.397 L 464 43.397 C 474.536 37.313 528 2.645 528 19.397 C 527.956 68.661 474.596 99.333 431.952 74.717 C 412.16 63.297 399.98 42.209 400 19.397 C 400 2.645 453.464 37.313 464 43.397 L 656 155.397 C 666.536 161.481 720 196.149 720 179.397 C 719.956 130.133 666.596 99.461 623.952 124.077 C 604.16 135.497 591.98 156.585 592 179.397 C 592 196.149 645.464 161.481 656 155.397 C 658.824 153.757 720 115.397 720 99.397 C 720 83.397 656 43.397 656 43.397 C 645.464 37.313 592 2.645 592 19.397 C 592.044 68.661 645.404 99.333 688.048 74.717 C 707.84 63.297 720.02 42.209 720 19.397 C 720 2.645 666.536 37.313 656 43.397 L 464 155.397 C 453.464 161.481 400 196.149 400 179.397 C 400.044 130.133 453.404 99.461 496.048 124.077 C 515.84 135.497 528.02 156.585 528 179.397 C 528 196.149 474.536 161.481 464 155.397 L 272 43.397 C 261.464 37.313 208 2.645 208 19.397 C 208.044 68.661 261.404 99.333 304.048 74.717 C 323.84 63.297 336.02 42.209 336 19.397 C 336 2.645 282.536 37.313 272 43.397 L 80 155.397 C 69.464 161.481 16 196.149 16 179.397 C 16.044 130.133 69.404 99.461 112.048 124.077 C 131.84 135.497 144.02 156.585 144 179.397 C 144 196.149 90.536 161.481 80 155.397 C 77.176 153.757 16 115.397 16 99.397 C 16 83.397 80 43.397 80 43.397 C 90.536 37.313 144 2.645 144 19.397 C 143.956 68.661 90.596 99.333 47.952 74.717 C 28.16 63.297 15.98 42.209 16 19.397'

  moving: boolean = false
  pathLength: number = 0
  DURATION_MULTIPLIER: number = 10
  maxSpeed: number = 0
  started: boolean = false
  finished: boolean = false

  animatedPathStyles: string = 'animation-play-state: paused'
  pathContainerStyles: string = 'animation-play-state: paused;'
  pathContainerTransform: string = 'scale(-1,-1) translate(-250, -250)'

  calculatePathStyles() {
    return `
      display: ${this.started ? 'initial' : 'none'};
      --path-length: ${this.pathLength};
      --path-duration: ${this.pathLength * this.DURATION_MULTIPLIER}ms;
      animation-play-state: ${this.moving ? 'running' : 'paused'};
    `
  }

  calculatePathContainerStyles() {
    return `
      --path-duration: ${this.pathLength * this.DURATION_MULTIPLIER}ms;
      animation-play-state: ${this.moving ? 'running' : 'paused'};
      motion-path: path('${this.pathD}');
      offset-path: path('${this.pathD}');
    `
  }

  adjustContainer() {
    // while(this.moving) {
    //   console.log('adjustContainer')
    // }
  }
  // can i actually do the opposite, and animate the path around the point? 🧐

  mousedown() {
    this.started = true
    this.moving = true
    this.adjustContainer()
    this.animatedPathStyles = this.calculatePathStyles()
    this.pathContainerStyles = this.calculatePathContainerStyles()
  }

  mouseup() {
    this.moving = false
    this.animatedPathStyles = this.calculatePathStyles()
    this.pathContainerStyles = this.calculatePathContainerStyles()
  }

  mouseout() {}

  mouseleave() {}

  mousemove() {}

  onAnimationEnd(e) {
    console.log(e)
    if (e.type === 'animationend') {
      this.finished = true
    }
  }

  mounted() {
    var path = document.querySelector('.animated-path')
    if (path) {
      this.pathLength = path.getTotalLength()
      console.log('path length:', this.pathLength)
    }

    document.querySelector('.animated-path').addEventListener('animationend', this.onAnimationEnd, false)

    this.animatedPathStyles = this.calculatePathStyles()
    this.pathContainerStyles = this.calculatePathContainerStyles()
  }

  beforeDestroy() {
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

  // The animation shorthand CSS property applies an animation between styles. It is a shorthand for animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, and animation-play-state
  animation: dash var(--path-duration) linear forwards; // TODO: set duration programatically
}

.path-container {
  animation: move var(--path-duration) linear forwards;
  // animation-fill-mode: backwards
  offset-rotate: 0deg;
  // motion-rotation: reverse;
}

@keyframes move { // TODO: maybe adjust by half the screen size?
  100% {
    motion-offset: 100%;
    offset-distance: 100%;
  }
}

@keyframes dash {
  from {
    stroke-dashoffset: var(--path-length);
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
