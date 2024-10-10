// // SettingsItem.tsx
// import React from "react";
// import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// interface SettingsItemProps {
//   icon: string;
//   label: string;
//   onPress: () => void;
//   rightIcon?: string;
// }

// const SettingsItem: React.FC<SettingsItemProps> = ({
//   icon,
//   label,
//   onPress,
//   rightIcon = "chevron-forward",
// }) => {
//   return (
//     <TouchableOpacity style={styles.item} onPress={onPress}>
//       <Ionicons name={icon} size={24} color="#4CAF50" />
//       <Text style={styles.text}>{label}</Text>
//       {rightIcon && <Ionicons name={rightIcon} size={24} color="#ccc" />}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   text: {
//     flex: 1,
//     marginLeft: 15,
//     fontSize: 16,
//     color: "#333",
//   },
// });

// export default SettingsItem;
