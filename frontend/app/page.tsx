import About from "@/components/About";
import GraphsandCharts from "@/components/GraphsandCharts";
import Intro from "@/components/Intro";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return(
    <div className="space-y-20">
      <Intro/>
      <About/>
      <GraphsandCharts/>
      <Testimonials/>
    </div>
  )
}
