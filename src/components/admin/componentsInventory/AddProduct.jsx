import React from "react";

const AddProduct = ({ addProduct, categories }) => {
  const productSubmit = async (event) => {
    event.preventDefault();
    await addProduct(event.target.product.value, event.target.category.value);
  };

  return (
    <div className="main-add-products">
      <form onSubmit={productSubmit} className="form-product">
        <div className="">
          <div>
            <label>Selecciona una categoría:</label>
            <select
              id="category"
              name="category"
              required
              className="select-product"
            >
              {categories && categories.length > 0 ? (
                categories.map((item, i) => (
                  <option value={item.name.toLowerCase()} key={i}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </option>
                ))
              ) : (
                <option disabled>Cargando categorías...</option>
              )}
            </select>
          </div>
          <div>
            <label>Nombre del nuevo elemento:</label>
            <input
              type="text"
              id="product"
              name="product"
              placeholder="Agregar producto"
              required
            />
          </div>
        </div>
        <button className="button-product" type="submit">
          Agregar Elemento
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
