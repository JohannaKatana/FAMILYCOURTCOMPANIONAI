import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { cryptoService } from "./lib/cryptoService";

cryptoService.init().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
