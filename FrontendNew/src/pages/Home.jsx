import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Blogs from '../components/Blogs';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className='homepage'>
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