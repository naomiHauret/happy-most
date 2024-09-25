import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { RootProvider } from "./components";
import { routeTree } from "./routeTree.gen";
import "@happy/uikit-react/fonts.css";
import "./app.css";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent"
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <RootProvider>
      <RouterProvider router={router} />
    </RootProvider>
  );
}
