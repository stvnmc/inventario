import React, { useEffect, useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";

const Products = ({ products, deleteProduct, quantities }) => {
  const [showNumberInput, setShowNumberInput] = useState({});
  const inputRefs = useRef({});

  // useEffect

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(inputRefs.current).forEach((key) => {
        if (
          inputRefs.current[key] &&
          !inputRefs.current[key].contains(event.target)
        ) {
          setShowNumberInput((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // funtion

  const toggleInput = (id) => {
    setShowNumberInput((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  async function onsubmit(e, iteamId) {
    e.preventDefault();
    const value = e.target.numero.value;
    await quantities(iteamId, value);
    setShowNumberInput((prev) => ({ ...prev, [iteamId]: false }));
  }

  return (
    <div className="products-cont">
      {products && products.length > 0 ? (
        products.map((iteam, i) => (
          <div key={i} className="product">
            <div className="name-product">
              <h2>{iteam.name}</h2>

              <div className="category-minimum">
                <p>{iteam.category},</p>
                <p>min: 5,</p>
                <p>ultima: 3:49am</p>
              </div>
            </div>
            <div className="values">
              <button onClick={() => quantities(iteam.id, "increase")}>
                <IoIosAdd />
              </button>
              <div className="value">
                {showNumberInput[iteam.id] ? (
                  <form
                    ref={(el) => (inputRefs.current[iteam.id] = el)}
                    onSubmit={(e) => onsubmit(e, iteam.id)}
                  >
                    <input
                      type="number"
                      id="numero"
                      name="numero"
                      required
                      min="0"
                      max="100"
                      placeholder={iteam.quantities}
                      className="input-num"
                      autoFocus
                    />
                  </form>
                ) : (
                  <p onClick={() => toggleInput(iteam.id)}>
                    {iteam.quantities}
                  </p>
                )}
              </div>
              <button onClick={() => quantities(iteam.id, "decrease")}>
                <RiSubtractFill />
              </button>
            </div>
            <div className="cont-button-delet">
              <button
                className="button-delet"
                onClick={() => deleteProduct(iteam.id)}
              >
                <AiOutlineClose />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="not-exist">
          <p>No existen productos</p>
        </div>
      )}
    </div>
  );
};

export default Products;
