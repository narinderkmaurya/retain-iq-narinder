import Header from "./components/Header";
import MobileView from "./components/MobileView";
import ProductVariantManager from "./components/ProductVariantManager";
import SideNav from "./components/SideNavbar";

export default function Home() {
  return (
    <div className="sm:min-h-screen bg-gray-100 overflow-x-hidden">
      <main className="flex sm:min-h-screen sm:w-full">
        <SideNav />
        <div className="sm:flex sm:items-start sm:justify-start  sm:px-6 lg:w-screen ">
          <div className="lg:hidden pl-2">
            <MobileView />
          </div>
          <div className="lg:block hidden">
            <ProductVariantManager />
          </div>
        </div>
      </main>
    </div>
  );
}
