import BottomForm from "@/components/bottomForm";
import { Colors } from "@/constants/Colors";
import { InventoryTransaction } from "@/constants/Types";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useFetch } from "@/contexts/usefetchData";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import {
  Redirect,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

export default function Index() {
  const { farmdet } = useGlobalSearchParams() as { farmdet: string };
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;

  // const [isSheetOpen, setIsSheetOpen] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [fetchedData, setFetchedData] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken } = authContext;

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // setIsSheetOpen(index !== -1);
    console.log("Sheet changed to index:", index);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [farmdet]);

  // const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: isSheetOpen
  //       ? { display: "none", position: "absolute", bottom: 0 }
  //       : {},
  //   });
  // }, [isSheetOpen]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/inventory/my/${farmdet}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (res.ok) {
        const data: InventoryTransaction[] = await res.json();
        setFetchedData(data); // Always set data even if empty
        setError(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  return (
    <GestureHandlerRootView
      style={{
        backgroundColor: color.cardBg,
        flex: 1,
        paddingBottom: 40,
      }}
    >
      <BottomSheetModalProvider>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: color.text }]}>
            My Spending
          </Text>
          <Pressable
            onPress={handlePresentModalPress}
            hitSlop={10}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add new Transaction</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={color.tint} />
        ) : error ? (
          <View style={styles.centeredView}>
            <Text style={{ color: "red" }}>{error}</Text>
          </View>
        ) : fetchedData?.length === 0 ? (
          <View style={styles.centeredView}>
            <Text style={{ color: color.text }}>No transactions yet.</Text>
          </View>
        ) : (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {fetchedData?.map((item, index) => (
              <View key={index} style={styles.Tcontainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color:
                          item.transactionType === "income"
                            ? Colors.linearGreen
                            : Colors.orange,
                      },
                    ]}
                  >
                    {item.transactionType}
                  </Text>
                </View>
                <View style={styles.rightSection}>
                  <Text
                    style={[
                      styles.amountText,
                      {
                        color:
                          item.transactionType === "income"
                            ? Colors.linearGreen
                            : Colors.orange,
                      },
                    ]}
                  >
                    {item.transactionType === "income" ? "+" : "-"} KES{" "}
                    {item.cost}
                  </Text>
                  <Text style={styles.dateText}>
                    {dayjs(item.createdAt).format("DD/MM/YYYY")}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <BottomForm
          userToken={userToken}
          farmId={farmdet}
          handleSheetChanges={handleSheetChanges}
          bottomSheetModalRef={bottomSheetModalRef}
          refetchTransactions={fetchTransactions}
          // isSheetOpen={isSheetOpen}
          // setIsSheetOpen={setIsSheetOpen}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#31A05F",
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  Tcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 6,
    marginBottom: 14,
  },
  desc: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.gray,
    marginVertical: 10,
  },
  typeText: {
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 4,
  },
  rightSection: {
    flexDirection: "column-reverse",
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  dateText: {
    fontWeight: "200",
    fontSize: 12,
    letterSpacing: 4,
    color: Colors.gray,
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
