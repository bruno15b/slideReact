import React from "react";
import styles from "./Slide.module.css";
import debounce from "./debounce";

const Slide = ({ slides }) => {
  const slidesWrapper = React.useRef([]);
  const slidesSelec = React.useRef([]);
  const [slideActive, setSlideActive] = React.useState(0);
  const [position, setPosition] = React.useState();
  const [initialClick, setInitalClick] = React.useState(0);
  const [travelMouseDist, setTravelMouseDist] = React.useState(0);
  const [clickEnable, setClickEnable] = React.useState(true);
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

  const returnSlideOrigin = debounce(() => {
    setPosition(-slidesSelec.current[slideActive].offsetLeft + (window.innerWidth - slidesSelec.current[slideActive].offsetWidth) / 2);
  }, 100);

  React.useEffect(() => {
    window.addEventListener("resize", returnSlideOrigin);
    return () => window.removeEventListener("resize", returnSlideOrigin);
  }, [slideActive]);

  function clickOnSlides(event) {
    if (event.clientX > window.innerWidth / 2 && slideActive < slides.length - 1) {
      setSlideActive(slideActive + 1);
    } else if (event.clientX <= window.innerWidth / 2 && slideActive > 0) {
      setSlideActive(slideActive - 1);
    }
  }

  const mouseOnMove = React.useCallback(
    (event) => {
      setTravelMouseDist(initialClick[0] - event.clientX);
      setPosition(initialClick[1] - (initialClick[0] - event.clientX));
    },
    [initialClick]
  );

  React.useEffect(() => {
    const target = slidesWrapper.current;
    if (initialClick) {
      target.addEventListener("mousemove", mouseOnMove);
    } else {
      target.removeEventListener("mousemove", mouseOnMove);
    }
    return () => target.removeEventListener("mousemove", mouseOnMove);
  }, [initialClick, mouseOnMove]);

  function mouseDownOnSlides(event) {
    setInitalClick([event.clientX, position]);
  }

  function slipPrevSlide() {
    setClickEnable(false);
    setSlideActive(slideActive - 1);
    setTravelMouseDist(0);
  }

  function slipNextSlide() {
    setClickEnable(false);
    setSlideActive(slideActive + 1);
    setTravelMouseDist(0);
  }

  function dontSlipPrevSlideReturn() {
    setClickEnable(false);
    returnSlideOrigin();
    setEnableClickWithtimer();
    setTravelMouseDist(0);
  }

  function dontSlipNextSlideReturn() {
    setClickEnable(false);
    returnSlideOrigin();
    setEnableClickWithtimer();
    setTravelMouseDist(0);
  }

  function mouseUpOnSlides() {
    setInitalClick(null);
    if (travelMouseDist > 50 && slideActive < slides.length - 1) {
      slipNextSlide();
    } else if (travelMouseDist < -50 && slideActive > 0) {
      slipPrevSlide();
    } else if (travelMouseDist < -50 && slideActive === 0) {
      dontSlipPrevSlideReturn();
    } else if (travelMouseDist > 50 && slideActive === slides.length - 1) {
      dontSlipNextSlideReturn();
    }
  }

  function setEnableClickWithtimer() {
    setTimeout(() => {
      setClickEnable(true);
    }, 500);
  }

  React.useEffect(() => {
    setClickEnable(true);
  }, [slideActive]);

  return (
    <>
      <section ref={slidesWrapper} onMouseDown={mouseDownOnSlides} onClick={clickEnable ? clickOnSlides : () => {}} onMouseUp={mouseUpOnSlides} className={styles.container}>
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
