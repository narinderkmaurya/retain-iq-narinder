import Header from "./components/Header";
import MobileView from "./components/MobileView";
import ProductVariantManager from "./components/ProductVariantManager";
import SideNav from "./components/SideNavbar";

export default function Home() {
  return (
    <div className="md:min-h-screen bg-gray-100 overflow-x-hidden">
      <main className="flex md:min-h-screen md:w-full">
        <SideNav />
        <div className="md:flex md:items-start md:justify-start  md:px-6 md:w-screen ">
          <div className="md:hidden">
            <MobileView />
          </div>
          <div className="md:block hidden">
            <ProductVariantManager />
          </div>
        </div>
      </main>
    </div>
  );
}
