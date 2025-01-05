import React, { useEffect, useRef, useState } from "react";
import { menu } from "../../infoPage/Menu";

function Menu() {
  const categoryRefs = useRef([]);
  const contentRef = useRef();

  /// img ///
  const [indexImg, setIndexImg] = useState(0);

  const [animate, setAnimate] = useState(true);

  /// scroll ///

  const scrollToCategory = (index) => {
    if (categoryRefs.current[index]) {
      setIndexImg(index);
      setAnimate(false);
      contentRef.current.scrollTo({
        top: categoryRefs.current[index].offsetTop - 322,
        behavior: "smooth",
      });

      setTimeout(() => {
        setAnimate(true);
      }, 100);
    }
  };

  const handleScroll = () => {
    const scrollTop = contentRef.current.scrollTop;

    categoryRefs.current.forEach((ref, index) => {
      const categoryTop = ref.offsetTop - 600;
      const nextCategoryTop =
        categoryRefs.current[index + 1]?.offsetTop - 600 || Infinity;

      if (scrollTop >= categoryTop && scrollTop < nextCategoryTop) {
        setIndexImg(index);
      }
    });
  };

  /// useEffect ///

  useEffect(() => {
    const element = contentRef.current;
    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setAnimate(false);

    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, [indexImg]);

  return (
    <div className="menu">
      {/* Carrusel Fijo */}
      <div className="carousel">
        {menu.map((item, index) => (
          <h3
            key={index}
            onClick={() => scrollToCategory(index)}
            className={indexImg === index ? "select" : "notSelect"}
          >
            {item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}
          </h3>
        ))}
      </div>

      {/* Platos */}
      <div className="menu-content" ref={contentRef}>
        {menu.map((category, index) => (
          <div
            key={index}
            ref={(el) => (categoryRefs.current[index] = el)}
            className="category"
          >
            <h1>{category.categoria.toUpperCase()}</h1>
            <div className="items">
              {category.items.map((item, subIndex) => (
                <div key={subIndex} className="menu-item">
                  <div>
                    <h2>{item.nombre}</h2>
                    <p>{item.descripcion}</p>
                  </div>
                  <h2>₡{item.precio}</h2>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* IMG */}
      <div className="cont-img">
        {animate ? (
          <img
            src={`${import.meta.env.BASE_URL}img/${menu[indexImg].img}.png`}
            alt="Menu item"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Menu;
