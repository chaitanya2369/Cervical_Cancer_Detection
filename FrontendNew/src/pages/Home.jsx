import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Stats from "../components/home/Stats";
import Services from "../components/home/Services";
import Blogs from "../components/home/Blogs";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="homepage">
      <Header />
      <Hero />
      <About />
      <Stats />
      <Services />
      <Blogs />
      <Footer />
    </div>
  );
}
