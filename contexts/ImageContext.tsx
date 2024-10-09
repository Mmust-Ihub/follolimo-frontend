import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface ImageContextType {
  imageUri: string | null;
  setImageUri: (uri: string) => void;
}

// Create the context with default values
const ImageContext = createContext<ImageContextType | undefined>(undefined);

// Provider component props interface
interface ImageProviderProps {
  children: ReactNode;
}

// Create a provider component
export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  return (
    <ImageContext.Provider value={{ imageUri, setImageUri }}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook to use the ImageContext
export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
