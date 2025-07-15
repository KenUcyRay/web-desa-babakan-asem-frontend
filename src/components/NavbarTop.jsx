import React from "react";
import { Link } from "react-router";

const NavbarTop = () => {
  return (
    <nav className="flex justify-between bg-(--warna-utama)">
      <div className="flex space-x-4 p-4">
        <Link to={"/pkk"} className=" hover:text-fuchsia-500">
          PKK
        </Link>
        <Link to={"/bumdes"} className="hover:text-fuchsia-500">
          BUMDES
        </Link>
        <Link to={"/karang-taruna"} className="hover:text-fuchsia-500">
          Karang Taruna
        </Link>
        <Link to={"/galeri"} className="hover:text-fuchsia-500">
          Galeri
        </Link>
      </div>
      <div className="flex space-x-4 p-4">
        <h2>idi</h2>
        <h2>idi</h2>
        <h2>idi</h2>
      </div>
    </nav>
  );
};

export default NavbarTop;
