import { Hero } from "@/app/components/Hero";
import { About } from "@/app/components/About";
import { Experience } from "@/app/components/Experience";
import { GitHubStats } from "@/app/components/GitHubStats";
import { NotablePRs } from "@/app/components/NotablePRs";
import { Projects } from "@/app/components/Projects";
import { Skills } from "@/app/components/Skills";
import { Academic } from "@/app/components/Academic";
import { Bookshelf } from "@/app/components/Bookshelf";
import { Contact } from "@/app/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <NotablePRs />
      <Projects />
      <Experience />
      <About />
      <GitHubStats />
      <Skills />
      <Academic />
      <Bookshelf />
      <Contact />
    </>
  );
}
