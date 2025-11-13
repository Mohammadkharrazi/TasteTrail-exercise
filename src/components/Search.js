import { useState } from "react";
import getSearch from "../helpers";

function Search({ dispatch }) {
  const [query, setQuery] = useState("");

  async function handleGetSearchData(query) {
    try {
      if (!query) return;

      dispatch({ type: "loading" });

      const newSearch = await getSearch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );

      dispatch({ type: "searchedComplete", payload: newSearch });
    } catch (err) {
      dispatch({ type: "searchInComplete", payload: err.message });
      console.error(err.message);
    }
  }

  return (
    <>
      <input
        type="text"
        className="search-bar"
        placeholder="Search food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={() => {
          handleGetSearchData(query);
          setQuery("");
        }}
        className="btn"
      >
        Search
      </button>
    </>
  );
}

export default Search;
