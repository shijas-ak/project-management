import SideMenubarItem from "./SideMenubarItem";
import SidebarCarousel from "./SidebarCarousel";
import { logout } from "../../../pages/logout";
import style from "./sidebar.module.css";
export default function SideMenuBar({
  collapsed,
  toggleMenu,
  menus,
  overlay,
  closeMenu,
}) {
  let sidebarClass = "side_bar";
  if (collapsed) {
    sidebarClass += " collapsed";
  } else if (overlay) {
    sidebarClass += " overlay";
  }

  return (
    <div className={sidebarClass}>
      <div className={`${style.sidebar_inner} sidebar_inner`}>
        <div
          className={`${style.menu_btn} menu_btn`}
          onClick={() => toggleMenu()}
        >
          <span className="icon-menu_btn"></span>
        </div>
        <div
          className={`${style.mobile_close} mobile_close`}
          onClick={() => closeMenu()}
        >
          <span className="icon-menu_btn"></span>
        </div>
        <div className={style.sidebar_content_wrapper}>
          <nav>
            <ul className={`${style.sidebar_link_list} sidebar_link_list`}>
              {menus &&
                menus.map((item, index) => (
                  <SideMenubarItem key={index} item={item} />
                ))}
              <li className="sidebar_item ">
                <a className="sidebar_link" onClick={logout}>
                  <span className={`${style.menu_icon} menu_icon`}>
                    <span className="icon-log_out"></span>
                  </span>
                  <span className="menu_title">Logout</span>
                </a>
              </li>
            </ul>
          </nav>
          <SidebarCarousel />
        </div>
      </div>
    </div>
  );
}
