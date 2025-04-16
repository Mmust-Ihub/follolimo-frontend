import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useFetch } from "@/contexts/usefetchData";
import { Colors } from "@/constants/Colors";

type bottomFormProps = {
  handleSheetChanges: (index: number) => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  farmId: string;
  userToken: string | null;
  refetchTransactions: () => Promise<void>;
  // isSheetOpen: boolean;
  // setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BottomForm = ({
  handleSheetChanges,
  bottomSheetModalRef,
  farmId,
  userToken,
  refetchTransactions,
  // isSheetOpen,
  // setIsSheetOpen,
}: bottomFormProps) => {
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [cost, setCost] = useState(0);

  const { fetchFarms } = useFetch();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!userToken || !farmId) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    if (!cost || !description) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (cost <= 0) {
      Alert.alert("Error", "Cost must be greater than 0");
      return;
    }
    if (description.length <= 4) {
      Alert.alert("Error", "Description is too short");
      return;
    }

    try {
      const payload = { transactionType, cost, description, farmId };
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/inventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Transaction submitted");
        setTransactionType("expense");
        setCost(0);
        setDescription("");
        bottomSheetModalRef.current?.close();
        refetchTransactions();
        fetchFarms();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  // const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: isSheetOpen
  //       ? { display: "none", position: "absolute", bottom: 0 }
  //       : {},
  //   });
  // }, [isSheetOpen]);

  return (
    <BottomSheetModal
      snapPoints={["100%", "100%"]}
      index={0}
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0} // tweak this
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.label}>Choose Transaction Type</Text>
            <View style={styles.row}>
              <Button
                title="Income"
                onPress={() => setTransactionType("income")}
                color={
                  transactionType === "income" ? Colors.linearGreen : "gray"
                }
              />
              <Button
                title="Expense"
                onPress={() => setTransactionType("expense")}
                color={transactionType === "expense" ? Colors.orange : "gray"}
              />
            </View>

            <Text style={styles.label}>Cost</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              onChangeText={(value) => setCost(Number(value))}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter transaction description"
              onChangeText={setDescription}
              multiline={true}
            />

            <Pressable
              style={{
                backgroundColor: Colors.dark.tint,
                padding: 15,
                borderRadius: 6,
                alignItems: "center",
                zIndex: 9999,
              }}
              onPress={handleSubmit}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Submit Transaction
              </Text>
            </Pressable>
          </BottomSheetView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 15,
  },
});

export default BottomForm;
