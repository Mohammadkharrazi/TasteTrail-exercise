function MenuItem({ meal, onHandleSearch }) {
  const { idMeal, strMeal, strMealThumb, filteredQuery, filteredsection } =
    meal;

  return (
    <div
      onClick={() => onHandleSearch(idMeal)}
      className="menu-item"
      id={idMeal}
    >
      <img src={strMealThumb} alt={strMeal} />
      <p className="menu-item-title">{strMeal}</p>

      <p className="menu-item-category">
        {filteredsection}: <strong>{filteredQuery}</strong>
      </p>
    </div>
  );
}

export default MenuItem;
