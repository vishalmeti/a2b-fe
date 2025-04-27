import { Button } from "@/components/ui/button";
import { Blocks, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../../public/Hero3.jpeg"

interface HeroProps {
  community: string;
}

export function Hero({ community }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-brand-green-light/20 to-brand-green/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-gradient-to-r from-brand-green to-brand-green px-3 py-1 text-sm text-white shadow-lg hover:scale-105 transition-transform duration-300">
              <Blocks className="mr-1 mb-2 h-7 w-7 inline animate-pulse" />
               <span className="text-lg font-bold mt-5">
                SHARD - IT 
                </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-brand-green to-brand-green/20 bg-clip-text text-transparent">
              Share More, Spend Less , Connect Better
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up">
              Access thousands of items from your neighbors without the burden of ownership. 
              Save money, reduce clutter, and build lasting community connections—all while 
              making our planet a little greener.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/browse">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-brand-green to-brand-green/90 hover:opacity-90 transition-all duration-30 shadow-lg hover:shadow-xl animate-bounce hover:animate-none">
                  Browse Items <ArrowRight className="ml-1.5 h-5 w-5 animate-bounce-x" />
                </Button>
              </Link>
              <Link to="/new-listing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-green text-brand-green hover:bg-brand-green/10 transition-all duration-300">
                  List Your First Item
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto max-w-[420px] lg:max-w-none lg:ml-auto">
            <div className="aspect-video overflow-hidden rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={hero}
                alt="People sharing items in a community"
                className=" w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
