import "./Header.css";
import htknLogo from "./assets/logos/HTKN.png";

export default function Header() {
  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo">
          <img
            src={htknLogo}
            alt="Logo HTKN"
            className="logo"
          />
        </div>
        <div className="header-title">
          <div className="header-main-title">
            <h1>Team HTKN</h1>
          </div>
          <div className="header-sub-title">
            <h2>La Chronologie</h2>
          </div>
        </div>
      </div>
    </header>
  );
}
