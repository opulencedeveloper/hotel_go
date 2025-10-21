"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import store from "@/store/redux";
import { Toaster } from "sonner";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-right" />
      {children}
    </Provider>
  );
}
