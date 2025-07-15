import React from "react";
import NavbarTop from "./NavbarTop";
import { Outlet } from "react-router";
import NavbarBottom from "./NavbarBottom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <NavbarTop />
      <NavbarBottom />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
