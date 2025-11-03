"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  // Detect theme from document class
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      closeButton={true}
      duration={2000}
      position="top-center"
      offset="20px"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "toast-custom",
          title: "toast-title",
          description: "toast-description",
          closeButton: "toast-close-button",
          success: "toast-success",
          error: "toast-error",
          info: "toast-info",
          warning: "toast-warning",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
