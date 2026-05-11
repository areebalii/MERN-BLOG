import AppSidebar from "@/components/AppSidebar"
import Footer from "@/components/Footer"
import Topbar from "@/components/Topbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        {/* min-h-full + flex-col ensures footer sticks to bottom */}
        <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
          <div className="flex-1 p-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default Layout