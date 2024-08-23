// import React from "react";
// import { GoHomeFill } from "react-icons/go";
// import { PiCat, PiChatCircleBold } from "react-icons/pi";
// import { RiSearchLine } from "react-icons/ri";
// import { FaRegUser } from "react-icons/fa6";
// import "../../styles/css/base/reset.css";
// import "../../styles/scss/components/common/footer.scss";
// import { Link } from "react-router-dom";

// export const Footer: React.FC = () => {
//   return (
//     <>
//       <footer>
//         <nav className="navbar">
//           <a href="/" className="navbar-item active">
//             <GoHomeFill></GoHomeFill>
//             <span>홈</span>
//           </a>
//           <a href="/" className="navbar-item">
//             <PiCat></PiCat>
//             <span>카테고리</span>
//           </a>
//           <a href="/chats/list" className="navbar-item">
//             <PiChatCircleBold></PiChatCircleBold>
//             <span>채팅</span>
//           </a>
//           <a href="/search" className="navbar-item">
//             <RiSearchLine></RiSearchLine>
//             <span>검색</span>
//           </a>
//           <a href="/" className="navbar-item">
//             <FaRegUser></FaRegUser>
//             <span>마이</span>
//           </a>
//         </nav>
//       </footer>
//     </>
//   );
// };

import React from "react";
import { GoHomeFill } from "react-icons/go";
import { PiCat, PiChatCircleBold } from "react-icons/pi";
import { RiSearchLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import "../../styles/css/base/reset.css";
import "../../styles/scss/components/common/footer.scss";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "홈", icon: <GoHomeFill /> },
  { to: "/boards", label: "카테고리", icon: <PiCat /> },
  { to: "/chats/list", label: "채팅", icon: <PiChatCircleBold /> },
  { to: "/search", label: "검색", icon: <RiSearchLine /> },
  { to: "/users", label: "마이", icon: <FaRegUser /> },
];

export const Footer: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }

    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <footer>
      <nav className="navbar">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={`navbar-item ${isActive(link.to) ? "active" : ""}`}>
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
};
