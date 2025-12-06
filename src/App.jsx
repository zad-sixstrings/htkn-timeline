import { useState, useCallback } from "react";
import "./App.css";
import Header from "./Header";
import Menu from "./Menu";
import Search from "./Search";
import Timeline from "./Timeline";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsCount, setResultsCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCountsUpdate = useCallback((filtered, total) => {
    setResultsCount(filtered);
    setTotalCount(total);
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Menu />
      <Search
        onSearchChange={handleSearchChange}
        resultsCount={resultsCount}
        totalCount={totalCount}
      />
      <Timeline
        searchQuery={searchQuery}
        onCountsUpdate={handleCountsUpdate}
      />
    </div>
  );
}

export default App;