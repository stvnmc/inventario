import React, { useContext, useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import AddCategory from "./componentsInventory/AddCategory";
import AddProduct from "./componentsInventory/AddProduct";
import Products from "./componentsInventory/Products";
import { IoIosAdd, IoMdClose, IoIosMore, IoMdArrowBack } from "react-icons/io";

const Inventory = ({ setSite, site }) => {
  // context

  const {
    addCategory,
    getCategories,
    deleteCategory,
    categories,
    addProduct,
    getProduct,
    products,
    deleteProduct,
    quantities,
    selectCategorie,
  } = useInventory();

  // UseState

  const [openAdd, setOpenAdd] = useState(null);
  const [allCategories, setAllCategories] = useState(false);

  // useEffect

  useEffect(() => {
    getCategories();
    getProduct();
    getProduct();
  }, []);

  // function

  function toggleCategorias() {
    setAllCategories(!allCategories);
  }

  return (
    <div className="cont-main-products">
      <div className="open-add-buttons-back">
        {openAdd === null && (
          <>
            <div className="list-categories">
              {/* button go dashboard  */}
              {site !== "dashboard" && (
                <button
                  className="go-back-dashboard"
                  onClick={() => setSite("dashboard")}
                >
                  <IoMdClose />
                </button>
              )}
              <div className="categories">
                {categories &&
                  categories.slice(0, 4).map((iteam, i) => (
                    <button key={i} onClick={() => selectCategorie(iteam.name)}>
                      {iteam.name}
                    </button>
                  ))}
              </div>
              <button className="icon" onClick={() => toggleCategorias()}>
                <IoIosMore />
              </button>
            </div>
            <div>
              <button
                className="open-category"
                onClick={() => setOpenAdd("category")}
              >
                Categoria
              </button>
              <button
                className="open-product"
                onClick={() => setOpenAdd("product")}
              >
                Producto
              </button>
            </div>
          </>
        )}

        {openAdd !== null && (
          <>
            <button className="go-back" onClick={() => setOpenAdd(null)}>
              <IoMdArrowBack />
            </button>
          </>
        )}
      </div>

      {/* show category and product */}

      {openAdd === "category" && (
        <div>
          <AddCategory
            addCategory={addCategory}
            deleteCategory={deleteCategory}
            categories={categories}
          />
        </div>
      )}

      {openAdd === "product" && (
        <div>
          <AddProduct categories={categories} addProduct={addProduct} />
        </div>
      )}

      {openAdd !== "category" && (
        <div className="main-products">
          <Products
            products={products}
            deleteProduct={deleteProduct}
            quantities={quantities}
          />
        </div>
      )}

      {/* show all category filters */}

      {allCategories && (
        <div className="all-categories">
          <div className="cont-all-categories">
            {categories &&
              categories.map((iteam, i) => (
                <button
                  className="categories-select"
                  onClick={() => selectCategorie(iteam.name)}
                  key={i}
                >
                  {iteam.name}
                </button>
              ))}
            <button
              className="close-all-categories"
              onClick={() => toggleCategorias()}
            >
              <IoMdArrowBack />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
