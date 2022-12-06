import React from "react";
import styles from "./Slide.module.css";

const Slide = ({ slides }) => {
  const item = React.useRef();
  const [ativo, setAtivo] = React.useState(0);
  const [position, setPosition] = React.useState(0);
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
    const { width } = item.current.getBoundingClientRect();
    setPosition(width * ativo);
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

  return (
    <section className={styles.container}>
      <div ref={item} style={{ transform: `translateX(${-position}px)` }} className={styles.content}>
        {slides.map((slide, index) => (
          <div style={{ background: cores[index] }} key={index} className={styles.item}>
            {slide.text}
          </div>
        ))}
      </div>
      <nav className={styles.nav}>
        <button onClick={slidePrev}>Anterior</button>
        <button onClick={slideNext}>Próximo</button>
      </nav>
    </section>
  );
};

export default Slide;
