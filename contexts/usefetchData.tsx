import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import { Alert } from "react-native";

// Define types for the context data
interface FetchContextType {
  farmData: FarmData[];
  Activity: Activity[]; // Added pastActivities

  loading: boolean;

  fetchFarms: () => Promise<void>;
}

// Define types for the data structures (these can be expanded as needed)
interface FarmData {
  location: string;
  farmId: string;
  farm: string;
  temperature: number;
  description: string;
  humidity: number;
  min_temp: number;
  pressure: number;
}

interface Activity {
  farmId: {
    _id: string;
    name: string;
  };
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

// Create FetchContext with a default value of undefined
const FetchContext = createContext<FetchContextType | undefined>(undefined);

// Custom hook to use the context
export const useFetch = () => {
  const context = useContext(FetchContext);
  if (!context) {
    throw new Error("useFetch must be used within a FetchProvider");
  }
  return context;
};

// Define FetchProvider props type
interface FetchProviderProps {
  children: ReactNode;
}

export const FetchProvider: React.FC<FetchProviderProps> = ({ children }) => {
  const [farmData, setFarmData] = useState<FarmData[]>([]);
  const [Activity, setActivity] = useState<Activity[]>([]); // Added tasks state

  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken, logout } = authContext;

  // Fetch Farms
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/summary`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // console.log("Fetched data:", data.weather);
      if (response.status === 200) {
        setFarmData(data?.weather);
        // setWeatherData(data?.weather);
        setActivity(data?.activities);
      }
      if (
        response.status === 401 ||
        data.message === "Invalid or expired token"
      ) {
        Alert.alert("Unauthorized", "Invalid or expired token");
        logout(); // Call the logout function from AuthContext
        return;
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Provide context values
  return (
    <FetchContext.Provider
      value={{
        farmData,
        Activity,
        loading,
        fetchFarms,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};
