import React, { useEffect, useRef, useState } from "react";
import { menu } from "../../infoPage/Menu";

function Menu() {
  const categoryRefs = useRef([]);
  const contentRef = useRef();
  const contPointRef = useRef();
  const contPointListMenuRef = useRef([]);

  /// img ///
  const [indexImg, setIndexImg] = useState(0);

  const [animate, setAnimate] = useState(true);

  /// scroll ///

  const scrollToCategory = (index) => {
    scrollPointMenu(index);
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

  const scrollPointMenu = (index) => {
    if (!contPointListMenuRef.current || !contPointRef.current) return;

    const currentCategory = contPointListMenuRef.current[index];

    if (!currentCategory) return;

    if (currentCategory.offsetTop <= 0) {
      contPointRef.current.style.top = "-46px";
      return;
    }

    const prevCategoryOffset =
      contPointListMenuRef.current[index - 1]?.offsetTop ?? 0;
    contPointRef.current.style.top = `${prevCategoryOffset - 3}px`;
  };

  const handleScroll = () => {
    if (!contentRef.current) return;

    const scrollTop = contentRef.current.scrollTop;

    categoryRefs.current.forEach((ref, index) => {
      const categoryTop = ref.offsetTop - 600;
      const nextCategoryTop =
        categoryRefs.current[index + 1]?.offsetTop - 600 || Infinity;

      if (scrollTop >= categoryTop && scrollTop < nextCategoryTop) {
        setIndexImg(index);
        scrollPointMenu(index);
      }
    });
  };

  /// useEffect ///

  useEffect(() => {
    if (!contentRef.current) return;

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

  useEffect(() => {
    chanceImgScroll();
  }, []);

  // img //

  const [img, setImg] = useState(0);

  function chanceImgScroll() {
    let value = 0;

    setInterval(() => {
      if (value === 0) {
        setImg(25);
        value = 25;
      } else if (value === 25) {
        setImg(50);
        value = 50;
      } else if (value === 50) {
        setImg(75);
        value = 75;
      } else {
        setImg(0);
        value = 0;
      }
    }, 5000);
  }

  return (
    <div className="main-menu">
      {/* icons floating */}
      <div className="icons-floating">
        <div className="flour">
          <img src={`${import.meta.env.BASE_URL}icons/flour.png`} alt={2} />
        </div>
        <div className="apple">
          <img
            src={`${import.meta.env.BASE_URL}icons/healthy-food.png`}
            alt={2}
          />
        </div>
        <div className="fungus">
          <img src={`${import.meta.env.BASE_URL}icons/mushroom.png`} alt={2} />
        </div>
        <div className="leaf">
          <img src={`${import.meta.env.BASE_URL}icons/leaf.png`} alt={2} />
        </div>
      </div>

      {/* img carrusel */}
      <div
        className="menu-cont-img-scroll"
        style={{ transform: `translateX(-${img}%)` }}
      >
        <div className={`menu-cont-img`}>
          <img
            src={`${import.meta.env.BASE_URL}img/fondoRosodiroma${2}.png`}
            alt={2}
          />
        </div>
        <div className="menu-cont-img">
          <img
            src={`${import.meta.env.BASE_URL}img/fondoRosodiroma${1}.png`}
            alt={1}
          />
        </div>
        <div className="menu-cont-img">
          <img
            src={`${import.meta.env.BASE_URL}img/fondoRosodiroma${2}.png`}
            alt={2}
          />
        </div>
        <div className="menu-cont-img">
          <img
            src={`${import.meta.env.BASE_URL}img/fondoRosodiroma${1}.png`}
            alt={1}
          />
        </div>
      </div>

      <div className="menu">
        {/* Carrusel Fijo */}
        <div className="carousel">
          {menu.map((item, index) => (
            <div
              key={index}
              ref={(el) => (contPointListMenuRef.current[index] = el)}
            >
              <h3
                onClick={() => scrollToCategory(index)}
                className={indexImg === index ? "select" : "notSelect"}
              >
                {item.categoria.charAt(0).toUpperCase() +
                  item.categoria.slice(1)}
              </h3>
            </div>
          ))}
          <div className="point-menu" ref={contPointRef}>
            .
          </div>
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

              {/* icon */}
              <div className="icon-category">
                <img
                  src={`${import.meta.env.BASE_URL}icons/${
                    category.categoria
                  }.png`}
                  alt={2}
                />
              </div>
              <div className="items">
                {category.items.map((item, subIndex) => (
                  <div key={subIndex} className="menu-item">
                    <div className="menu-item-cont">
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
    </div>
  );
}

export default Menu;
