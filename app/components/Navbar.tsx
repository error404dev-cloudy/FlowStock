"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Atom, HandHeart, LayoutDashboard, ListTree, Menu, PackagePlus, Receipt, ShoppingBasket, Warehouse, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { checkAndAddAssociation } from "../actions";
import Stock from "./Stock";
import { useTheme } from "./ThemeProvider";

const Navbar = () => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "Produits", icon: ShoppingBasket },
    { href: "/new-product", label: "Nouveau Produit", icon: PackagePlus },
    { href: "/category", label: "Catégories", icon: ListTree },
    { href: "/give", label: "Donner", icon: HandHeart },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/", label: "Tableau de Bord", icon: LayoutDashboard },
    
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddAssociation(user.primaryEmailAddress.emailAddress, user.fullName);
    }
  }, [user]);

  const renderLinks = (baseClass: string) => (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        const activeClass = isActive ? "btn-primary" : "btn-ghost";
        return (
          <Link
            href={href}
            key={href}
            className={`${baseClass} ${activeClass} btn-sm flex gap-3 items-center text-lg px-4 py-2`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}

      <button
        onClick={() => (document.getElementById("my_modal_stock") as HTMLDialogElement).showModal()}
        className={`btn btn-sm btn-ghost flex gap-3 items-center text-lg px-4 py-2`}
      >
        <Warehouse className="w-5 h-5" />
        Alimenter le stock
      </button>
    </>
  );

  const toggleRetroTheme = () => {
    toggleTheme();
  };

  return (
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 relative">
      <div className="flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleRetroTheme}
          title={`Switch to ${theme === "lemonade" ? "retro" : "lemonade"} theme`}
        >
          <div className="p-2">
            <Atom className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl select-none">FlowStock.</span>
        </div>

        <button className="btn w-fit sm:hidden btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="hidden space-x-2 sm:flex items-center">
          {renderLinks("btn")}
          <UserButton />
        </div>
      </div>

      <div
        className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 transition-transform duration-300 sm:hidden z-50 ${
          menuOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="flex justify-between">
          <UserButton />
          <button className="btn w-fit sm:hidden btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {renderLinks("btn")}
      </div>

      <Stock />
    </div>
  );
};

export default Navbar;
