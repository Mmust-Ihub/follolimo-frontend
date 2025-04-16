import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useGlobalSearchParams } from "expo-router";
import DateTimePicker from "react-native-modal-datetime-picker";
import dayjs from "dayjs";

const Tabs = ["All", "Upcoming", "Past"];

const Tasks = () => {
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  const { userToken } = authContext || {};
  const isDarkMode = themeContext?.isDarkMode ?? false;

  interface Activity {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string;
    status: string;
  }

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const { farmdet } = useGlobalSearchParams() as { farmdet: string };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchActivities = async (type?: string) => {
    setLoading(true);
    try {
      let url = "https://fololimo.vercel.app/api/activity";
      if (type) url += `/?type=${type}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await res.json();
      setActivities(data?.activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "All") fetchActivities();
    else fetchActivities(activeTab?.toLowerCase());
  }, [activeTab]);

  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;

  const handleCreateActivity = async () => {
    if (!title || !description || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    if (new Date(startDate) < new Date()) {
      alert("Start date cannot be in the past.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("https://fololimo.vercel.app/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          farmId: farmdet,
          title,
          description,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (data?.activity) {
        setShowCreateModal(false);
        setTitle("");
        setDescription("");
        fetchActivities(); // refresh list
      }
    } catch (error) {
      console.error("Failed to create activity:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor, padding: 16 }}>
      {/* Tabs */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {Tabs?.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={{
                fontWeight: activeTab === tab ? "bold" : "normal",
                color: activeTab === tab ? "#4B9CD3" : textColor,
                borderWidth: activeTab === tab ? 2 : 0,
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 8,
                borderColor: activeTab === tab ? "#4B9CD3" : "transparent",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Activity Button */}
      <View style={{ marginVertical: 16 }}>
        <Pressable
          onPress={() => setShowCreateModal(true)}
          style={{
            backgroundColor: "#22c55e",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            + Create Activity
          </Text>
        </Pressable>
      </View>

      {/* Activities List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4B9CD3"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: isDarkMode ? "#333" : "#eee",
                padding: 16,
                marginVertical: 8,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: textColor, fontWeight: "bold" }}>
                {item.title}
              </Text>
              <Text style={{ color: textColor }}>{item.description}</Text>
              <Text style={{ color: textColor }}>
                {dayjs(item.startDate).format("MMM D, YYYY")} →{" "}
                {dayjs(item.endDate).format("MMM D, YYYY")}
              </Text>
              <Text style={{ color: "#10b981", fontWeight: "600" }}>
                Status: {item.status}
              </Text>
            </View>
          )}
        />
      )}

      {/* Create Activity Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? "#111" : "#fff",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 10,
                color: textColor,
              }}
            >
              New Activity
            </Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#333"
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#333"
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <Pressable
              onPress={() => setStartPickerVisible(true)}
              style={styles.input}
            >
              <Text
                style={{
                  color: "#333",
                }}
              >
                Select Start Date
              </Text>
            </Pressable>
            <DateTimePicker
              isVisible={isStartPickerVisible}
              mode="date"
              onConfirm={(date) => {
                setStartPickerVisible(false);
                setStartDate(date);
              }}
              onCancel={() => setStartPickerVisible(false)}
            />

            <Pressable
              onPress={() => setEndPickerVisible(true)}
              style={styles.input}
            >
              <Text
                style={{
                  color: "#333",
                }}
              >
                Select End Date
              </Text>
            </Pressable>
            <DateTimePicker
              isVisible={isEndPickerVisible}
              mode="date"
              onConfirm={(date) => {
                setEndPickerVisible(false);
                setEndDate(date);
              }}
              onCancel={() => setEndPickerVisible(false)}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Pressable
                style={[styles.button, { backgroundColor: "#ccc" }]}
                onPress={() => setShowCreateModal(false)}
                disabled={creating}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: creating ? "#94d3a2" : "#22c55e",
                    opacity: creating ? 0.7 : 1,
                  },
                ]}
                onPress={handleCreateActivity}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Create
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    elevation: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    color: "#000",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  button: {
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
});
