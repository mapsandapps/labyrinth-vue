export type Point = {
  x: number
  y: number
}

export type MovementStoreState = {
  animatedPathStyles: string
  circlePositionWithinLabyrinth: DOMPoint | null
  currentHeading: number | null
  currentSpeed: number
  currentTouchDirection: number | null
  debugHeading: string
  debugMode: boolean
  debugTouchDirection: string
  finished: boolean
  moving: boolean
  pathContainerTransform: string
  pathElement: Element | null
  pathLength: number
  position: number
  started: boolean
  waypoint: Point
  windowHeight: number
  windowWidth: number
}
