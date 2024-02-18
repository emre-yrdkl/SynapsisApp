import * as React from "react"
import Svg, { Rect, Mask, Path, G } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={120}
    height={120}
    fill="none"
    {...props}
  >
    <Rect width={118} height={118} x={1} y={1} fill="#EFEFF0" rx={59} />
    <Rect
      width={118}
      height={118}
      x={1}
      y={1}
      stroke="#AFB1B6"
      strokeWidth={2}
      rx={59}
    />
    <Mask
      id="a"
      width={20}
      height={20}
      x={50}
      y={50}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M50 50h19.96v19.95H50V50Z"
        clipRule="evenodd"
      />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill="#AFB1B6"
        fillRule="evenodd"
        d="M55.65 51.5c-2.52 0-4.15 1.727-4.15 4.399v8.152c0 2.673 1.63 4.399 4.15 4.399h8.65c2.527 0 4.16-1.726 4.16-4.399v-8.152c0-2.672-1.633-4.399-4.16-4.399h-8.65Zm8.65 18.45h-8.65c-3.38 0-5.65-2.371-5.65-5.899v-8.152C50 52.371 52.27 50 55.65 50h8.65c3.385 0 5.66 2.371 5.66 5.899v8.152c0 3.528-2.275 5.899-5.66 5.899Z"
        clipRule="evenodd"
      />
    </G>
    <Path
      fill="#AFB1B6"
      fillRule="evenodd"
      d="M53.281 65.18a.748.748 0 0 1-.544-1.265l1.528-1.613a2.156 2.156 0 0 1 3.037-.09l.958.971c.267.27.701.275.97.011.1-.119 2.278-2.764 2.278-2.764a2.427 2.427 0 0 1 1.647-.876 2.448 2.448 0 0 1 1.784.545c.043.035.082.07 2.278 2.324a.75.75 0 1 1-1.074 1.046s-2.049-2.103-2.195-2.245a.92.92 0 0 0-.649-.177.933.933 0 0 0-.632.337c-2.324 2.82-2.352 2.846-2.39 2.883a2.184 2.184 0 0 1-3.086-.032s-.93-.944-.946-.963c-.23-.214-.643-.2-.89.061l-1.53 1.613a.747.747 0 0 1-.544.234ZM56.558 56.129a1.004 1.004 0 1 0 .002 2.009 1.004 1.004 0 0 0-.002-2.01Zm0 3.509a2.507 2.507 0 0 1-2.503-2.505 2.506 2.506 0 0 1 2.504-2.504 2.509 2.509 0 0 1 2.505 2.504 2.508 2.508 0 0 1-2.505 2.505Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default SvgComponent
