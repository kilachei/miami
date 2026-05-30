import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Squad from "./components/Squad";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Squad />
        <Contact />
      </main>
    </>
  );
}