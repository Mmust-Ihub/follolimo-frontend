import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import React, { useContext } from "react";
import { View, Text } from "react-native";
// import { BarChart } from "react-native-gifted-charts";

export default function index() {
  
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;
  const barData = [
    {
      value: 40,
      label: "Jan",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: Colors.light.tabIconSelected,
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 50,
      label: "Feb",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: Colors.light.tabIconSelected,
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 75,
      label: "Mar",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: Colors.light.tabIconSelected,
    },
    { value: 25, frontColor: "#ED6665" },
    {
      value: 30,
      label: "Apr",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: Colors.light.tabIconSelected,
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 60,
      label: "May",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: Colors.light.tabIconSelected,
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 65,
      label: "Jun",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: Colors.light.tabIconSelected,
    },
    { value: 30, frontColor: "#ED6665" },
  ];

  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 30 }}>
        <Text
          style={{
            color: color.text,

            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
         My Spending
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 24,
            backgroundColor: "yellow",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: color.tabIconSelected,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 16,
                color: color.textDisabled,
              }}
            >
              Debits
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "#ED6665",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 16,
                color: color.textDisabled,
              }}
            >
              Credits
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: color.cardBg,
        paddingBottom: 40,
        borderRadius: 10,
        flex: 1,
      }}
    >
      <Text style={{ color: color.text, fontSize: 20, fontWeight: "bold" }}>
        {" "}
        My Spending
      </Text>

      {/* {renderTitle()}
      <BarChart
        data={barData}
        barWidth={8}
        spacing={24}
        roundedTop
        yAxisColor={color.text}
        xAxisColor={color.text}
        yAxisTextStyle={{ color: color.text, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: color.text, fontSize: 12 }}
        roundedBottom
        // hideRules
        backgroundColor={color.cardBg}
        xAxisThickness={0}
        yAxisThickness={0}
        noOfSections={3}
        maxValue={75}
      /> */}
    </View>
  );
};
