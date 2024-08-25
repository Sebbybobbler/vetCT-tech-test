import { Routes, Route, BrowserRouter } from "react-router-dom";
import CasesView from "./CasesView.tsx";
import Root from "./Root.tsx";
import SingleCaseView from "./SingleCaseView.tsx";
import "./assets/css/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<CasesView />} />
          <Route path=":caseId" element={<SingleCaseView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
