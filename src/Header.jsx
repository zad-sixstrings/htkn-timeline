import "./App.css";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <div className="header-logo">
        <img src="./src/assets/logos/HTKN.png" alt="Logo HTKN" className="logo" />
      </div>
      <div className="header-title">
        <div className="header-main-title">
          <h1>Team HTKN</h1>
        </div>
        <div className="header-sub-title">
            <h2>La Chronologie</h2>
        </div>
      </div>
    </header>
  );
}
