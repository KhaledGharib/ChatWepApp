import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./components/App.tsx";
import JoinPage from "./components/JoinPage.tsx";
import { ContextProvider } from "./context/useStateContext";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <JoinPage />,
  },
  {
    path: "/chat",
    element: <App />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
