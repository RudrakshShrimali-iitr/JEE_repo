import React, { useState, ReactNode } from "react";

interface TabsProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const Tabs = ({ defaultValue, onValueChange, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange(value);
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { activeTab, handleTabChange }) : child
      )}
    </div>
  );
};

interface TabsListProps {
  children: ReactNode;
}

export const TabsList = ({ children }: TabsListProps) => {
  return <div className="flex border-b">{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  children: ReactNode;
}

export const TabsTrigger = ({ value, activeTab, handleTabChange, children }: TabsTriggerProps) => {
  return (
    <button
      className={`py-2 px-4 text-sm font-medium focus:outline-none ${
        activeTab === value ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
      }`}
      onClick={() => handleTabChange && handleTabChange(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  activeTab?: string;
  children: ReactNode;
}

export const TabsContent = ({ value, activeTab, children }: TabsContentProps) => {
  return activeTab === value ? <div className="p-4">{children}</div> : null;
};
