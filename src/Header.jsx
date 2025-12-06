import "./Header.css";
import { useRotatingLogo } from "./utils/useRotatingLogo";

export default function Header() {
  const { currentLogo, isGlitching } = useRotatingLogo(5000);

  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo">
          <img
            src={currentLogo}
            alt="Logo HTKN"
            className={`logo ${isGlitching ? "glitching" : ""}`}
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