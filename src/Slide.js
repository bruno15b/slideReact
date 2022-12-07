import React from "react";
import styles from "./Slide.module.css";
import debounce from "./debounce";

const Slide = ({ slides }) => {
  const slidesSelec = React.useRef([]);
  const [slideActive, setSlideActive] = React.useState(0);
  const [position, setPosition] = React.useState();
  const [randomColors] = React.useState(() => {
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
    setPosition(-slidesSelec.current[slideActive].offsetLeft + (window.innerWidth - slidesSelec.current[slideActive].offsetWidth) / 2);
  }, [slideActive]);

  function slidePrev() {
    if (slideActive > 0) {
      setSlideActive(slideActive - 1);
    }
  }

  function slideNext() {
    if (slideActive < slides.length - 1) {
      setSlideActive(slideActive + 1);
    }
  }

  function resizeSlide() {
    setPosition(-slidesSelec.current[slideActive].offsetLeft + (window.innerWidth - slidesSelec.current[slideActive].offsetWidth) / 2);
  }

  React.useEffect(() => {
    window.addEventListener("resize", debounce(resizeSlide, 100));
    return () => window.removeEventListener("resize", resizeSlide);
  });

  function clickOnSlides(event) {
    if (event.clientX > window.innerWidth / 2 && slideActive < slides.length - 1) {
      setSlideActive(slideActive + 1);
    } else if (event.clientX <= window.innerWidth / 2 && slideActive > 0) {
      setSlideActive(slideActive - 1);
    }
  }

  return (
    <>
      <section onClick={clickOnSlides} className={styles.container}>
        <div style={{ transform: `translateX(${position}px)` }} className={styles.content}>
          {slides.map((slide, index) => (
            <div
              ref={(element) => {
                slidesSelec.current[index] = element;
              }}
              style={{ background: randomColors[index] }}
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
