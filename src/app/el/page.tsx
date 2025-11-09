import SpotChart from "@/components/spotchart";
import { getSpotPrices } from "@/lib/spotprices";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";

export default async function SpotPricePage() {
  const todayLocal = new Date().toLocaleDateString("sv-SE");
  const data = await getSpotPrices(todayLocal);

  return (
    <>
      <Navbar />
      <div className="font-sans  p-8 sm:p-20 bg-sky-150">
        <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="flex flex-col items-center w-full lg:col-span-2 border rounded-lg p-6  shadow">
            <h1 className="text-3xl font-bold text-primary mb-8">
              💡 Spotpriser för el i Sverige ({todayLocal})
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <SpotChart key="1" data={data.SE1} title="SE1" />
              <SpotChart key="2" data={data.SE2} title="SE2" />
              <SpotChart key="3" data={data.SE3} title="SE3" />
              <SpotChart key="4" data={data.SE4} title="SE4" />
            </div>
          </main>

          <aside className="hidden lg:block lg:col-span-1">
            <Aside />
          </aside>
        </div>

        <Footer />
      </div>
    </>
  );
}
