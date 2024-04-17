import * as React from "react"
import Svg, { Path } from "react-native-svg"
const LeaveArrow = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      fill="#FEFEFE"
      d="M.939 6.212a1.5 1.5 0 0 0 0 2.12l5.656 5.659a1.5 1.5 0 1 0 2.122-2.122L5.62 8.772H12a1.5 1.5 0 0 0 0-3H5.62l3.097-3.096A1.5 1.5 0 1 0 6.595.554L.939 6.212Z"
    />
  </Svg>
)
export default LeaveArrow
