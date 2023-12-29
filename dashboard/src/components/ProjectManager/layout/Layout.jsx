import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom/dist";
import SideMenuBar from "../sidebar/SideMenuBar";
import PageHeader from "../header/Header";

const Layout = () => {
  const {userId} = useParams()

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSideMenu, setMobileSideMenu] = useState(false);

  const menus = [
    {
      title: "Dashboard",
      path: `/pm-dashboard/${userId}`,
      icon: "icon-dashboard",
      children: null,
    },
    {
      title: "Projects",
      path: `/pm-projects/${userId}`,
      icon: "icon-dashboard",
      children: null,
    },
    { title: "Tasks", path: `/pm-tasks/${userId}`, icon: "icon-dashboard", children: null },
    {
      title: "Profile",
      path: `/pm-profile/${userId}`,
      icon: "icon-profile",
      children: null,
    },
  ];

  useEffect(() => {
    let sidebar = document.querySelector(".side_bar");
    let header = document.querySelector(".header");
    let contentInner = document.querySelector(".content_inner");
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        if (sidebar && sidebar.classList.contains("collapsed")) {
          sidebar.classList.remove("collapsed");
        }
        if (header && header.classList.contains("expand")) {
          header.classList.remove("expand");
        }
        if (contentInner && contentInner.classList.contains("expand")) {
          contentInner.classList.remove("expand");
        }
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function toggleMenu() {
    setCollapsed(!collapsed);
  }

  function showMobileMenu() {
    setMobileSideMenu(!mobileSideMenu);
  }

  function closeMenu() {
    setMobileSideMenu(false);
  }

  return (
    <>
      <SideMenuBar
        collapsed={collapsed}
        toggleMenu={toggleMenu}
        menus={menus}
        overlay={mobileSideMenu}
        closeMenu={closeMenu}
      />
      <div className={collapsed === false ? "main_panel" : "main_panel expand"}>
        <PageHeader showMobileMenu={showMobileMenu} />
        <div className="content">
          <div
            className={
              collapsed === false ? "content_inner" : "content_inner expand"
            }
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
