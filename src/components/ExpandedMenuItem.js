function ExpandedMenuItem({ searchedMeal, dispatch, filteredMeal }) {
  const {
    idMeal,
    strCategory,
    strInstructions,
    ingredients,
    titleMeal,
    imageMeal,
  } = searchedMeal;
  return (
    <div className="menu-item-expanded" id={idMeal}>
      {filteredMeal?.length ? (
        <svg
          onClick={() => dispatch({ type: "backToFilteredData" })}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z" />
        </svg>
      ) : null}
      <img className="menu-item-image" src={imageMeal} alt={titleMeal} />
      <div className="menu-item-expanded-description">
        <p className="menu-item-title">{titleMeal}</p>

        <p className="menu-item-category">
          category: <strong>{strCategory}</strong>
        </p>
        <p className="instructions">{strInstructions}</p>
        <div className="ingredients">
          {ingredients.map((ing) => (
            <span>{ing}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpandedMenuItem;
