import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
export default function Tab() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext not found");
  }
  const { logout } = authContext;
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoutButton: {
    backgroundColor: "#f44336", // Red button for logout
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8, // Rounded corners like a native button
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
    width: "100%", // Make button full width like in native settings
  },
  logoutText: {
    color: "#fff", // White text for contrast
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
