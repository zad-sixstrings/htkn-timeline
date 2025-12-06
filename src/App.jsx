import "./App.css";
import Header from "./Header";
import Menu from "./Menu";
import Timeline from "./Timeline";
import Search from "./Search";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsCount, setResultsCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

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
        onCountsUpdate={(filtered, total) => {
          setResultsCount(filtered);
          setTotalCount(total);
        }}
      />
    </div>
  );
}

export default App;
