import * as React from "react"
import Svg, { Path } from "react-native-svg"
const GoBackSvgWhiteSmall = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5}
      d="m12 3-9 9 9 9"
    />
  </Svg>
)
export default GoBackSvgWhiteSmall
