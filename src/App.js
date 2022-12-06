import Slide from "./Slide";

const App = () => {
  const slides = [
    { id: "slide1", text: "Slide 1" },
    { id: "slide2", text: "Slide 2" },
    { id: "slide3", text: "Slide 3" },
    { id: "slide3", text: "Slide 4" },
    { id: "slide3", text: "Slide 5" },
    { id: "slide3", text: "Slide 6" },
  ];
  return (
    <div>
      <Slide slides={slides} />
    </div>
  );
};
export default App;
