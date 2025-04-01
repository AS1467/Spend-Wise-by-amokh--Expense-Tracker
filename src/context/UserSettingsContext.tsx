
import React, { createContext, useEffect, useState } from "react";

interface UserSettings {
  name: string;
  currency: string;
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateName: (name: string) => void;
  updateCurrency: (currency: string) => void;
  greeting: string;
  formatCurrency: (amount: number) => string;
}

const defaultSettings: UserSettings = {
  name: "",
  currency: "USD",
};

export const UserSettingsContext = createContext<UserSettingsContextType>({
  settings: defaultSettings,
  updateName: () => {},
  updateCurrency: () => {},
  greeting: "",
  formatCurrency: () => "",
});

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Try to get settings from localStorage on initial render
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Generate greeting based on time of day
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greetingText = "";
      
      if (hour < 12) {
        greetingText = "Good morning";
      } else if (hour < 18) {
        greetingText = "Good afternoon";
      } else {
        greetingText = "Good evening";
      }
      
      if (settings.name) {
        greetingText += `, ${settings.name}`;
      }
      
      setGreeting(greetingText);
    };

    updateGreeting();
    // Update greeting every minute
    const intervalId = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(intervalId);
  }, [settings.name]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  const updateName = (name: string) => {
    setSettings((prev) => ({ ...prev, name }));
  };

  const updateCurrency = (currency: string) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  // Format currency based on selected currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: settings.currency,
    }).format(amount);
  };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        updateName,
        updateCurrency,
        greeting,
        formatCurrency,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
