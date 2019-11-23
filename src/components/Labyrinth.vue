<template>
  <div>
    <svg
      width="500"
      height="500"
      viewBox="0 0 960 960"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mouseleave="mouseleave"
      @mouseout="mouseout"
      @mousemove="mousemove">
      <path
        class="outline"
        stroke="#546e7a"
        stroke-width="30"
        fill="none"
        :d="pathD" />
      <path
        id="animated-path"
        class="path"
        :style="animatedPathStyles"
        :d="pathD"
        stroke="#B58A47"
        stroke-width="20"
        fill="none" />
      <circle
        class="marker"
        :style="animatedMarkerStyles"
        r="4"
        fill="orange" />
    </svg>
    <span v-if="finished">Done!</span>
    <!-- <button id="button" @click="transition">Restart</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// TODO: remove d3 and d3-path if this works

@Component
export default class Labyrinth extends Vue {
  pathD: string = 'M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128'

  moving: boolean = false
  pathLength: number = 0
  SPEED_MULTIPLIER: number = 4
  maxSpeed: number = 0
  finished: boolean = false

  animatedPathStyles: string = 'animation-play-state: paused'
  animatedMarkerStyles: string = 'animation-play-state: paused;'

  // get cssVars () {
  //   return {
  //     '--path-length': this.pathLength,
  //     // more
  //   }
  // }

  calculatePathStyles(running) {
    return `
      --path-length: ${this.pathLength};
      animation-play-state: ${running? 'running' : 'paused'};
    `
  }

  calculateMarkerStyles(running) {
    return `
      animation-play-state: ${running? 'running' : 'paused'};
      motion-path: path('${this.pathD}');
      offset-path: path('${this.pathD}');
    `
  }

  mousedown() {
    console.log('mousedown')
    this.moving = true
    this.animatedPathStyles = this.calculatePathStyles(this.moving)
    this.animatedMarkerStyles = this.calculateMarkerStyles(this.moving)
  }

  mouseup() {
    console.log('mouseup')
    this.moving = false
    this.animatedPathStyles = this.calculatePathStyles(this.moving)
    this.animatedMarkerStyles = this.calculateMarkerStyles(this.moving)
  }

  mouseout() {
    console.log('mouseout')
  }

  mouseleave() {
    console.log('mouseleave')
  }

  mousemove() {
    console.log('mousemove')
  }

  listener(e) {
    console.log(e)
    if (e.type === 'animationend') {
      this.finished = true
    }
  }

  mounted() {
    var path = document.querySelector('.path')
    if (path) {
      this.pathLength = path.getTotalLength()
      console.log(this.pathLength)
      // TODO: somehow set this to all values that are currently 3000 (and possibly 100% as well)
    }


    var element = document.getElementById('animated-path');
    if (element) {
      // TODO: remove these listeners at some point
      element.addEventListener('animationstart', this.listener, false)
      element.addEventListener('animationend', this.listener, false)
      element.addEventListener('animationiteration', this.listener, false)
    }
    // this.path = d3.select('path')

    // let l = this.path.node().getTotalLength()
    // this.maxSpeed = l * this.SPEED_MULTIPLIER
  }
}
</script>

<style scoped lang="scss">
.path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);

  // The animation shorthand CSS property applies an animation between styles. It is a shorthand for animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, and animation-play-state
  animation: dash 5s linear forwards; // TODO: set duration programatically
}

.marker {
  animation: move 5s linear forwards;
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
