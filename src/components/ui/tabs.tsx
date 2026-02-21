"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs compound components must be used within <TabsRoot />");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  TabsRoot                                                                  */
/* -------------------------------------------------------------------------- */

export interface TabsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value of the initially active tab */
  defaultValue: string;
  /** Controlled active value */
  value?: string;
  /** Callback when the active tab changes */
  onValueChange?: (value: string) => void;
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const activeTab = value ?? internalValue;

    const setActiveTab = React.useCallback(
      (next: string) => {
        if (!value) setInternalValue(next);
        onValueChange?.(next);
      },
      [value, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
TabsRoot.displayName = "TabsRoot";

/* -------------------------------------------------------------------------- */
/*  TabsList                                                                  */
/* -------------------------------------------------------------------------- */

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

/* -------------------------------------------------------------------------- */
/*  TabsTrigger                                                               */
/* -------------------------------------------------------------------------- */

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The unique value that identifies this tab */
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kpp-yellow",
          isActive
            ? "text-gray-900"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
          className
        )}
        onClick={() => setActiveTab(value)}
        {...props}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-kpp-yellow" />
        )}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

/* -------------------------------------------------------------------------- */
/*  TabsContent                                                               */
/* -------------------------------------------------------------------------- */

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value that links this content panel to its trigger */
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn("mt-3 focus-visible:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { TabsRoot, TabsList, TabsTrigger, TabsContent };
