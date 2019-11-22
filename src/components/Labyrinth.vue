<template>
  <div class="hello">
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
        :d="pathD"
        stroke="#B58A47"
        stroke-width="20"
        fill="none" />
      <circle r="20" transform="translate(256, 384)" />
    </svg>
    <button id="button" @click="transition">Restart</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as d3 from 'd3'

// help from https://bl.ocks.org/mbostock/1705868

@Component
export default class Labyrinth extends Vue {
  pathD: string = 'M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128'

  moving: boolean = false


  SPEED_MULTIPLIER: number = 4

  maxSpeed: number = 0

  circle = d3.select('circle')

  path = d3.select('path')

  mousedown() {
    console.log('mousedown')
    this.moving = true
    this.circle.transition()
      .duration(this.maxSpeed)
      .attrTween("transform", this.translateAlong(this.path.node()))
      .ease(d3.easeLinear)
    // TODO: http://xaedes.de/dev/transitions/
    // or maybe better yet the spiral example here: https://observablehq.com/@lemonnish/svg-path-animations-d3-transition
  }

  mouseup() {
    console.log('mouseup')
    this.moving = false
    this.circle.transition()
      .duration(0)
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

  mounted() {
    this.path = d3.select('path')
    this.circle = d3.select('circle')

    let l = this.path.node().getTotalLength()
    this.maxSpeed = l * this.SPEED_MULTIPLIER
  }

  // Returns an attrTween for translating along the specified path element.
  translateAlong(path) {
    var l = path.getTotalLength();
    return function() {
      return function(t) {
        var p = path.getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
  }

  transition() {
    this.circle.transition()
      .duration(this.maxSpeed)
      .attrTween("transform", this.translateAlong(this.path.node()))
      .ease(d3.easeLinear)
      .on("end", this.transition)
  }
}
</script>

<style scoped lang="scss">
circle {
  fill: steelblue;
  stroke: #fff;
  stroke-width: 5px;
}
</style>
