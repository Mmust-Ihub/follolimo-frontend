import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

type bottomFormProps = {
  handleSheetChanges: (index: number) => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  farmId: string;
  userToken: string | null;
  refetchTransactions: () => Promise<void>;
};

const BottomForm = ({
  handleSheetChanges,
  bottomSheetModalRef,
  farmId,
  userToken,
  refetchTransactions,
}: bottomFormProps) => {
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [cost, setCost] = useState(0);

  console.log("userToken", userToken, "farmid", farmId);
  const handleSubmit = async () => {
    // if not cost,title,description, farmId, userToken
    if (!cost || !description || !farmId || !userToken) {
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
      const payload = {
        transactionType,
        cost,
        description,
        farmId,
      };
      console.log("payload", payload);
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
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "An error occurred"}`);
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <BottomSheetModal
      snapPoints={["50%", "100%"]}
      index={0}
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.label}>Transaction Type</Text>
        <View style={styles.row}>
          <Button
            title="Income"
            onPress={() => setTransactionType("income")}
            color={transactionType === "income" ? "green" : "gray"}
          />
          <Button
            title="Expense"
            onPress={() => setTransactionType("expense")}
            color={transactionType === "expense" ? "red" : "gray"}
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
          placeholder="Enter description"
          onChangeText={(value) => setDescription(value)}
          multiline={true}
        />

        <Button title="Submit" onPress={handleSubmit} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 4,
    gap: 10,
  },
});

export default BottomForm;
