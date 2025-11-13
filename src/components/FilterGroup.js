function FilterGroup({ itemData, filteredQuery, dispatch, children }) {
  return (
    <div className="filter-group">
      <label>{children[0].toUpperCase() + children.slice(1)}</label>
      <select
        value={filteredQuery}
        onChange={(e) =>
          dispatch({
            type: "getFilter",
            payload1: e.target.value,
            payload2: children,
          })
        }
        id={children}
      >
        <option value="">
          {children === "category"
            ? children[0].toUpperCase() + children.slice(1, -1) + "ies"
            : children[0].toUpperCase() + children.slice(1) + "s"}
        </option>
        {itemData.length ? (
          itemData.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))
        ) : (
          <option disabled value="error">
            Something went wrong
          </option>
        )}
      </select>
    </div>
  );
}

export default FilterGroup;
