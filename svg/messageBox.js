import * as React from "react"
import Svg, { Path } from "react-native-svg"
const MessageBox = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 9.4h10.8M7 14.2h10.8M7 19h6m12-6c0 6.628-5.372 12-12 12H1V13C1 6.372 6.372 1 13 1s12 5.372 12 12Z"
    />
  </Svg>
)
export default MessageBox
