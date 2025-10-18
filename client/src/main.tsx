import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./services/store.ts";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Analytics />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e3a8a",
            color: "#fff",
            fontWeight: "bold",
          },
        }}
      />
    </Provider>
  </StrictMode>
);
