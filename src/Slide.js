import React, { useEffect } from "react";
import styles from "./Slide.module.css";

const Slide = ({ slides }) => {
  const corpoSlide = React.useRef();
  const itens = React.useRef([]);
  const [ativo, setAtivo] = React.useState(0);
  const [position, setPosition] = React.useState();
  const [cores] = React.useState(() => {
    return slides.reduce((arrayAcc) => {
      const newItem =
        "#" +
        parseInt(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0");
      return [...arrayAcc, newItem];
    }, []);
  });

  React.useEffect(() => {
    const { width } = corpoSlide.current.getBoundingClientRect();
    setPosition(width * ativo);
    const margin = +getComputedStyle(itens.current[ativo]).marginLeft.replace("px", "");
    setPosition(-itens.current[ativo].offsetLeft + margin + (window.innerWidth - itens.current[ativo].offsetWidth - 2 * margin) / 2);
  }, [ativo]);

  function slidePrev() {
    if (ativo > 0) {
      setAtivo(ativo - 1);
    }
  }

  function slideNext() {
    if (ativo < slides.length - 1) {
      setAtivo(ativo + 1);
    }
  }
  function downClick(event) {
    if (event.clientX > window.innerWidth / 2 && ativo < slides.length - 1) {
      setAtivo(ativo + 1);
    } else if (event.clientX <= window.innerWidth / 2 && ativo > 0) {
      setAtivo(ativo - 1);
    }
  }

  function resizeSlide() {
    const margin = +getComputedStyle(itens.current[ativo]).marginLeft.replace("px", "");
    setPosition(-itens.current[ativo].offsetLeft + margin + (window.innerWidth - itens.current[ativo].offsetWidth - 2 * margin) / 2);
  }

  useEffect(() => {
    window.addEventListener("resize", resizeSlide);
    return () => window.removeEventListener("resize", resizeSlide);
  });

  return (
    <>
      <section onMouseDown={downClick} className={styles.container}>
        <div ref={corpoSlide} style={{ transform: `translateX(${position}px)` }} className={styles.content}>
          {slides.map((slide, index) => (
            <div
              ref={(element) => {
                itens.current[index] = element;
              }}
              style={{ background: cores[index] }}
              key={index}
              className={styles.item}
            >
              {slide.text}
            </div>
          ))}
        </div>
      </section>
      <nav className={styles.nav}>
        <button onClick={slidePrev}>Anterior</button>
        <button onClick={slideNext}>Próximo</button>
      </nav>
    </>
  );
};

export default Slide;
