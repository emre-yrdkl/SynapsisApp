import * as React from "react"
import Svg, { Path } from "react-native-svg"
const searchSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#FF9F1C"
      d="m19.6 21-6.3-6.3A6.096 6.096 0 0 1 9.5 16c-1.817 0-3.354-.63-4.612-1.888C3.63 12.853 3.001 11.316 3 9.5c0-1.817.63-3.354 1.888-4.612C6.147 3.63 7.684 3.001 9.5 3c1.817 0 3.354.63 4.613 1.888C15.372 6.147 16.001 7.684 16 9.5a6.096 6.096 0 0 1-1.3 3.8l6.3 6.3-1.4 1.4ZM9.5 14c1.25 0 2.313-.437 3.188-1.312S14.001 10.751 14 9.5c0-1.25-.437-2.312-1.312-3.187S10.751 5.001 9.5 5c-1.25 0-2.312.438-3.187 1.313S5.001 8.251 5 9.5c0 1.25.438 2.313 1.313 3.188S8.251 14.001 9.5 14Z"
    />
  </Svg>
)
export default searchSvg
