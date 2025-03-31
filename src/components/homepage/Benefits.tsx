import { HandCoins, Leaf, Users } from "lucide-react";

export const Benefits = () => {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-neutral-light px-3 py-1 text-sm">
              Why Borrow?
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-brand-green">
              Benefits of Borrowing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Borrowing is better for your wallet, your space, and the planet.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
              <HandCoins className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold">Save Money</h3>
            <p className="text-muted-foreground">
              Why buy expensive items you'll only use occasionally?
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
              <Leaf className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold">Reduce Waste</h3>
            <p className="text-muted-foreground">
              Help the environment by reducing consumption and waste
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
              <Users className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold">Build Community</h3>
            <p className="text-muted-foreground">
              Connect with neighbors and build a stronger community
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
