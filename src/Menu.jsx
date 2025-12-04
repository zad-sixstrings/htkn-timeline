import "./Menu.css";
import Info from "./Info";
import Contribute from "./Contribute";
import { useState } from "react";

export default function Menu() {
  const [showInfo, setShowInfo] = useState(false);
  const [showContribute, setShowContribute] = useState(false);

  return (
    <>
      <div className="menu-wrapper">
        <div className="menu-about">
          <button onClick={() => setShowInfo(true)} className="menu-button">
            Kezako?
          </button>
        </div>
        <div className="menu-contribute">
          <button
            onClick={() => setShowContribute(true)}
            className="menu-button"
          >
            Contribuer
          </button>
        </div>
      </div>
      <Info isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <Contribute
        isOpen={showContribute}
        onClose={() => setShowContribute(false)}
      />
    </>
  );
}
