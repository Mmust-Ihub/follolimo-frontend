import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";

// Define types for the context data
interface FetchContextType {
  farmData: FarmData[];
  tasks: Task[];
  weatherData: WeatherData | null;
  loading: boolean;
  fetchFarms: () => Promise<void>;
}

// Define types for the data structures (these can be expanded as needed)
interface FarmData {
  name: string;
  location: string;
  city_name: string;
  size: number;
  city: number;
}

interface Task {
  activity: string;
  date: string;
  status: string;
  cost: number;
  duration: string;
  farm: string;
}

interface WeatherData {
  temperature: number;
  description: String;
  city: String;
  humidity: number;
  min_temp: number;
  max_temp: number;
  pressure: number;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken } = authContext;

  // Fetch Farms
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/details/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFarmData(data.farms);
      setWeatherData(data.weather);
      setTasks(data.activities);
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
        tasks,
        weatherData,
        loading,
        fetchFarms,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};
