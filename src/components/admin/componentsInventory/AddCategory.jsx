import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

const AddCategory = ({ addCategory, categories, deleteCategory }) => {
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const categorySubmit = async (event) => {
    event.preventDefault();

    const res = await addCategory(event.target.category.value);

    if (res === true) inputRef.current.value = "";
    if (res === "exist") setError("Esta categoria ya existe");
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  return (
    <div>
      <form className="form-category" onSubmit={categorySubmit}>
        <div>
          <label htmlFor="text">Categoria</label>
          <input
            type="category"
            id="category"
            name="category"
            placeholder="Category del producto"
            required
            className="input-field"
            ref={inputRef}
          />
        </div>

        <button type="submit" className="button-category">
          Agregar categoria
        </button>

        <div className="category-error">{error && <p>{error}</p>}</div>
      </form>
      <div className="showCategories">
        {categories
          ? categories.map((item, i) => (
              <div key={i} className="cont-show-category">
                <h2>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </h2>
                <IoMdClose onClick={() => deleteCategory(item.id)} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default AddCategory;
