import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import DebtSection from './components/DebtSection'
import CaseStudy from './components/CaseStudy'
import Calculator from './components/Calculator'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <DebtSection />
        <CaseStudy />
        <Calculator />
        <HowItWorks />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
