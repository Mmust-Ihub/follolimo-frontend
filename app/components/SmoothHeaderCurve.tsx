import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

function SmoothHeaderCurve() {
  return (
    <View
      style={{ position: "absolute", top: -50, left: 0, right: 0, zIndex: 999 }}
    >
      <Svg
        height={180}
        width="100%"
        viewBox="0 0 1440 320"
        style={{ position: "absolute", top: 0 }}
      >
        <Path
          fill="#22c55e"
          d="M0,160C80,130,160,100,240,120C320,140,400,200,480,210C560,220,640,180,720,160C800,140,880,140,960,130C1040,120,1120,100,1200,80C1280,60,1360,40,1440,20L1440,0L0,0Z"
        />
      </Svg>
    </View>
  );
}

export default SmoothHeaderCurve;
