import App from "./App";
import { createRoot } from "react-dom/client";
import * as serviceWorker from './serviceWorker'

createRoot(document.getElementById('root')).render(<App />)

serviceWorker.unregister();
