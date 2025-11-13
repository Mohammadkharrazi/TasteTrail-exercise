import { useEffect, useReducer } from "react";

import Header from "./Header";
import FilterGroup from "./FilterGroup";
import Search from "./Search";
import MenuItem from "./MenuItem";
import Error from "./Error";
import Loader from "./Loader";
import ExpandedMenuItem from "./ExpandedMenuItem";
import getSearch from "../helpers";

const initialState = {
  searchedMeal: {},
  mainStatus: "open",
  categories: [],
  categoryStatus: "",
  areas: [],
  areaStatus: "",
  mainIngs: [],
  ingsStatus: "",
  filteredMeal: [],
  filteredQuery: "",
  filteredsection: "",
  errMessage: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, mainStatus: "isLoading" };
    case "searchedComplete":
      return {
        ...state,
        mainStatus: "searchWasOk",
        searchedMeal: action.payload,
        filteredMeal: [],
        filteredQuery: "",
        filteredsection: "",
      };
    case "idSearchedComplete":
      return {
        ...state,
        mainStatus: "idSearchWasOk",
        searchedMeal: action.payload,
      };
    case "searchInComplete":
      return {
        ...state,
        mainStatus: "searchError",
        errMessage: action.payload,
      };
    case "getCategories":
      return {
        ...state,
        categoryStatus: "categoriesReceived ",
        categories: action.payload,
      };
    case "getAreas":
      return {
        ...state,
        areaStatus: "areasReceived ",
        areas: action.payload,
      };
    case "getIngredients":
      return {
        ...state,
        ingsStatus: "ingsReceived ",
        mainIngs: action.payload,
      };
    case "getFilter":
      return {
        ...state,
        filteredQuery: action.payload1,
        filteredsection: action.payload2,
      };
    case "getFilteredDataComplete":
      return {
        ...state,
        filteredMeal: action.payload,
        mainStatus: "filterSearchWasOk",
      };
    case "getFilteredDataInComplete":
      return { ...state, mainStatus: "searchError" };
    case "backToFilteredData":
      return { ...state, mainStatus: "filterSearchWasOk" };
    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    {
      searchedMeal,
      mainStatus,
      categories,
      areas,
      mainIngs,
      filteredMeal,
      filteredQuery,
      filteredsection,
      errMessage,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // these useEffects will get all of the data which needed for displaying filters
  useEffect(function () {
    async function getAllCategories() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
        );
        const data = await res.json();
        // api data is an array of objects i just made it to be an array of strings
        const fixedCategory = data.meals.slice(0, 6).map((c) => c.strCategory);

        dispatch({ type: "getCategories", payload: fixedCategory });
      } catch (err) {
        console.error(err.message);
      }
    }

    getAllCategories();
  }, []);

  useEffect(function () {
    async function getAllIngredients() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
        );
        const data = await res.json();
        const FixedIng = data.meals
          .slice(4, 10)
          .map((ing) => ing.strIngredient);

        dispatch({ type: "getIngredients", payload: FixedIng });
      } catch (err) {
        console.error(err.message);
      }
    }

    getAllIngredients();
  }, []);

  useEffect(function () {
    async function getAllAreas() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
        );
        const data = await res.json();
        const fixedArea = data.meals.slice(0, 5).map((a) => a.strArea);

        dispatch({ type: "getAreas", payload: fixedArea });
      } catch (err) {
        console.err(err.message);
      }
    }

    getAllAreas();
  }, []);

  async function handleGetFilteredData(query, querySection) {
    try {
      if (!query || !querySection) return;

      dispatch({ type: "loading" });

      let sectionToSearch =
        querySection === "category"
          ? "c"
          : querySection === "main ingredient"
          ? "i"
          : querySection === "area"
          ? "a"
          : "";

      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?${sectionToSearch}=${query}`
      );
      const data = await res.json();

      // i wrote this variable so i get few data from api
      const slicedData =
        data.meals.length > 6 ? data.meals.slice(0, 6) : data.meals;

      // in MenuItem component i needed these queries so i added them to every object in my sliced data
      const mainData = slicedData.map((d) => {
        d.filteredQuery = filteredQuery;
        d.filteredsection = filteredsection;
        return d;
      });

      dispatch({ type: "getFilteredDataComplete", payload: mainData });
    } catch (err) {
      console.error(err.message);
      dispatch({ type: "getFilteredDataInComplete" });
    }
  }

  async function handleSearchDataWithId(idMeal) {
    try {
      if (!idMeal) return;

      const newSearch = await getSearch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );

      dispatch({ type: "idSearchedComplete", payload: newSearch });
    } catch (err) {
      dispatch({ type: "searchInComplete", payload: err.message });
      console.error(err.message);
    }
  }

  return (
    <div className="container">
      <Header />
      <div className="filters">
        <FilterGroup
          dispatch={dispatch}
          filteredQuery={filteredQuery}
          itemData={categories}
        >
          category
        </FilterGroup>
        <FilterGroup
          dispatch={dispatch}
          filteredQuery={filteredQuery}
          itemData={mainIngs}
        >
          main ingredient
        </FilterGroup>
        <FilterGroup
          dispatch={dispatch}
          filteredQuery={filteredQuery}
          itemData={areas}
        >
          area
        </FilterGroup>
        <button
          onClick={() => handleGetFilteredData(filteredQuery, filteredsection)}
          className="btn"
        >
          Search by filter
        </button>
      </div>
      <div className="search-container">
        <Search dispatch={dispatch} />
      </div>
      <div className="menu-container">
        {mainStatus === "searchWasOk" && (
          <ExpandedMenuItem dispatch={dispatch} searchedMeal={searchedMeal} />
        )}
        {mainStatus === "idSearchWasOk" && (
          <ExpandedMenuItem
            dispatch={dispatch}
            searchedMeal={searchedMeal}
            filteredMeal={filteredMeal}
          />
        )}
        {mainStatus === "isLoading" && <Loader />}
        {mainStatus === "filterSearchWasOk" &&
          filteredMeal.map((meal) => (
            <MenuItem
              onHandleSearch={handleSearchDataWithId}
              key={meal.idMeal}
              meal={meal}
            />
          ))}
        {mainStatus === "searchError" && <Error err={errMessage} />}
      </div>
    </div>
  );
}
