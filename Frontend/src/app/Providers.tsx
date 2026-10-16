"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { LanguageProvider } from "../utils/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>{children}</LanguageProvider>
    </Provider>
  );
}
