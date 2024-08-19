import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home.tsx";
import Root from "./Root.tsx";
import "./App.css";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root />}>
                        <Route index element={<Home />} />
                        {/* <Route path="sessions" element={<Sessions />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
