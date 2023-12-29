import { useState } from "react"
import style from "./sidebar.module.css"
import { Link } from "react-router-dom";

export default function SideMenubarItem({ item }) {
    const [open] = useState(false);


    
    const iconClass = item.icon || '';
    return (

        <li className={`sidebar_item `}>
        <div className={`sidebar_title ${open ? "open" : ""}`}>
          {item.path ? (
            <Link to={item.path} className="sidebar_link">
              <span className={`${style.menu_icon} menu_icon`}>
                <span className={iconClass}></span>
              </span>
              <span className="menu_title">{item.title}</span>
            </Link>
          ) : (
            <div className="sidebar_link">
              <span className={`${style.menu_icon} menu_icon`}>
                <span className={iconClass}></span>
              </span>
              <span className="menu_title">{item.title}</span>
            </div>
          )}
          <span className="toggle_btn"></span>
        </div>
      </li>
    )
}