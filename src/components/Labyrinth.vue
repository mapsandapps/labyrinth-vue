<template>
  <div>
    <svg
      width="500"
      height="500"
      viewBox="0 0 384 112"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mouseleave="mouseleave"
      @mouseout="mouseout"
      @mousemove="mousemove">
      <path
        class="outline"
        stroke="#B58A47"
        stroke-width="7"
        fill="none"
        :d="pathD" />
      <path
        class="outline"
        stroke="#546e7a"
        stroke-width="6"
        fill="none"
        :d="pathD" />
      <path
        id="animated-path"
        class="path"
        :style="animatedPathStyles"
        :d="pathD"
        stroke="#B58A47"
        stroke-width="3"
        fill="none" />
      <g
        class="marker"
        :style="animatedMarkerStyles">
        <circle
          r="5"
          fill="#B58A47" />
        <circle
          r="4"
          fill="#FFCD7D" />
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
  pathD: string = 'M 16 17.133 C 16 8.757 42.732 26.091 48 29.133 L 144 85.133 C 149.268 88.175 176 105.509 176 97.133 C 175.978 72.501 149.298 57.165 127.976 69.473 C 118.08 75.183 111.99 85.727 112 97.133 C 112 105.509 138.732 88.175 144 85.133 L 240 29.133 C 245.268 26.091 272 8.757 272 17.133 C 271.978 41.765 245.298 57.101 223.976 44.793 C 214.08 39.083 207.99 28.539 208 17.133 C 208 8.757 234.732 26.091 240 29.133 L 336 85.133 C 341.268 88.175 368 105.509 368 97.133 C 367.978 72.501 341.298 57.165 319.976 69.473 C 310.08 75.183 303.99 85.727 304 97.133 C 304 105.509 330.732 88.175 336 85.133 C 337.412 84.313 368 65.133 368 57.133 C 368 49.133 336 29.133 336 29.133 C 330.732 26.091 304 8.757 304 17.133 C 304.022 41.765 330.702 57.101 352.024 44.793 C 361.92 39.083 368.01 28.539 368 17.133 C 368 8.757 341.268 26.091 336 29.133 L 240 85.133 C 234.732 88.175 208 105.509 208 97.133 C 208.022 72.501 234.702 57.165 256.024 69.473 C 265.92 75.183 272.01 85.727 272 97.133 C 272 105.509 245.268 88.175 240 85.133 L 144 29.133 C 138.732 26.091 112 8.757 112 17.133 C 112.022 41.765 138.702 57.101 160.024 44.793 C 169.92 39.083 176.01 28.539 176 17.133 C 176 8.757 149.268 26.091 144 29.133 L 48 85.133 C 42.732 88.175 16 105.509 16 97.133 C 16.022 72.501 42.702 57.165 64.024 69.473 C 73.92 75.183 80.01 85.727 80 97.133 C 80 105.509 53.268 88.175 48 85.133 C 46.588 84.313 16 65.133 16 57.133 C 16 49.133 48 29.133 48 29.133 C 53.268 26.091 80 8.757 80 17.133 C 79.978 41.765 53.298 57.101 31.976 44.793 C 22.08 39.083 15.99 28.539 16 17.133'

  moving: boolean = false
  pathLength: number = 0
  DURATION_MULTIPLIER: number = 10
  maxSpeed: number = 0
  started: boolean = false
  finished: boolean = false

  animatedPathStyles: string = 'animation-play-state: paused'
  animatedMarkerStyles: string = 'animation-play-state: paused;'

  calculatePathStyles() {
    return `
      display: ${this.started ? 'initial' : 'none'};
      --path-length: ${this.pathLength};
      --path-duration: ${this.pathLength * this.DURATION_MULTIPLIER}ms;
      animation-play-state: ${this.moving ? 'running' : 'paused'};
    `
  }

  calculateMarkerStyles() {
    return `
      --path-duration: ${this.pathLength * this.DURATION_MULTIPLIER}ms;
      animation-play-state: ${this.moving ? 'running' : 'paused'};
      motion-path: path('${this.pathD}');
      offset-path: path('${this.pathD}');
    `
  }

  mousedown() {
    this.started = true
    this.moving = true
    this.animatedPathStyles = this.calculatePathStyles()
    this.animatedMarkerStyles = this.calculateMarkerStyles()
  }

  mouseup() {
    this.moving = false
    this.animatedPathStyles = this.calculatePathStyles()
    this.animatedMarkerStyles = this.calculateMarkerStyles()
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
    var path = document.querySelector('.path')
    if (path) {
      this.pathLength = path.getTotalLength()
      console.log('path length:', this.pathLength)
    }

    document.getElementById('animated-path').addEventListener('animationend', this.onAnimationEnd, false)

    this.animatedPathStyles = this.calculatePathStyles()
    this.animatedMarkerStyles = this.calculateMarkerStyles()
  }

  beforeDestroy() {
    document.getElementById('animated-path').removeEventListener('animationend', this.onAnimationEnd, false)
  }
}
</script>

<style scoped lang="scss">
.path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);

  // The animation shorthand CSS property applies an animation between styles. It is a shorthand for animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, and animation-play-state
  animation: dash var(--path-duration) linear forwards; // TODO: set duration programatically
}

.marker {
  animation: move var(--path-duration) linear forwards;
}

@keyframes move {
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
