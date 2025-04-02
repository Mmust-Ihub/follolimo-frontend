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
  pastActivities: Activity[]; // Added pastActivities
  upComingActivity: Activity[]; // Added upComingActivity
  weatherData: WeatherData | null;
  loading: boolean;
  isPastActivitiesLoading: boolean; // Added loading state for past activities
  isUpcomingActivitiesLoading: boolean; // Added loading state for upcoming activities
  fetchFarms: () => Promise<void>;
  fetchPastActivities: () => Promise<void>; // Added fetchPastActivities
  fetchUpcomingActivities: () => Promise<void>; // Added fetchUpcomingActivities
}

// Define types for the data structures (these can be expanded as needed)
interface FarmData {
  name: string;
  location: string;
  city_name: string;
  size: number;
  city: number;
}

interface Activity {
  id: string;
  farm: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: string; // Optional status field
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
  const [pastActivities, setPastActivities] = useState<Activity[]>([]);
  const [upComingActivity, setUpComingActivity] = useState<Activity[]>([]); // Added tasks state

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPastActivitiesLoading, setIsPastActivitiesLoading] = useState(false); // Added loading state for past activities
  const [isUpcomingActivitiesLoading, setIsUpcomingActivitiesLoading] = useState(false); // Added loading state for upcoming activities
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken } = authContext;
  // https://fololimo.vercel.app/api/activity/?type=past
  // fetch past activities
  const fetchPastActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/activity/?type=past`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setPastActivities(data?.activities);
    } catch (error) {
      console.error("Error fetching past activities:", error);
    } finally {
      setIsPastActivitiesLoading(false);
    }
  };
  // fetch upcoming activities
  const fetchUpcomingActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/activity/?type=upcoming`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUpComingActivity(data?.activities);
    } catch (error) {
      console.error("Error fetching upcoming activities:", error);
    } finally {
      setIsUpcomingActivitiesLoading(false);
    }
  }

  // Fetch Farms
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/farm`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Fetched data:", data);
      setFarmData(data);
      setWeatherData(data?.weather);
      // setTasks(data?.activities);
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
        pastActivities,
        upComingActivity,
        weatherData,
        loading,
        fetchFarms,
        fetchPastActivities, // Added fetchPastActivities to the context
        fetchUpcomingActivities,
        isPastActivitiesLoading, // Added loading state for past activities
        isUpcomingActivitiesLoading, // Added loading state for upcoming activities
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};
