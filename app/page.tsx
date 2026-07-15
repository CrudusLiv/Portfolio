import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Skills } from '@/components/skills'
import { Trajectory } from '@/components/trajectory'
import { Projects } from '@/components/projects'
import { Credentials } from '@/components/credentials'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Trajectory />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
