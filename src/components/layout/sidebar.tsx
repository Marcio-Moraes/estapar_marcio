"use client"

import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/ui/estapar_estacionamentos_logo.png";
import Link from "next/link";
import { LuBuilding2, LuCar, LuMenu, LuX, LuHouse } from "react-icons/lu";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const menuItems = [
    {
      href: "/",
      label: "Início",
      icon: LuHouse,
      active: pathname === "/",
    },
    {
      href: "/garagens",
      label: "Garagens",
      icon: LuBuilding2,
      active: pathname.startsWith("/garagens"),
    },
    {
      href: "/mensalistas",
      label: "Mensalistas",
      icon: LuCar,
      active: pathname.startsWith("/mensalistas"),
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
        <Link href="/" onClick={closeSidebar}>
          <Image src={logo} alt="Logo" width={110} height={50} className="object-contain" />
        </Link>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-30 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 py-6 flex flex-col z-40 transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close Button on Mobile Drawer */}
        <div className="flex lg:hidden justify-end px-6 mb-2">
          <button 
            onClick={closeSidebar} 
            className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Brand Logo - Desktop */}
        <div className="hidden lg:flex items-center justify-center pb-6 border-b border-gray-100">
          <Link href="/">
            <Image 
              src={logo} 
              loading="lazy" 
              alt="Logo" 
              width={140} 
              height={70} 
              className="mx-auto object-contain" 
            />
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 mt-6">
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      item.active
                        ? "bg-[#7AD33E]/10 text-[#5fa530] font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`mr-3 transition-transform group-hover:scale-110 ${
                        item.active ? "text-[#7AD33E]" : "text-gray-400 group-hover:text-gray-600"
                      }`} 
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};