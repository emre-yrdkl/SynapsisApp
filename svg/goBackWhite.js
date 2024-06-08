
import * as React from "react"
import Svg, { Path } from "react-native-svg"
const GoBackSvgWhite = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={32}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={6}
      d="M16 3 3 16l13 13"
    />
  </Svg>
)
export default GoBackSvgWhite
