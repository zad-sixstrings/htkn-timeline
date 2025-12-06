import "./modal.css";

export default function Contribute({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Contribuer</h2>
        <p>
          Vous souhaitez contribuer en suggérant un évènement? Vous avez repéré
          une information erronnée et aimeriez proposer une correction?
        </p>
        <p>Voici plusieurs moyens de contact à choix:</p>
        <ul>
          <li>
            <a
              href="https://www.facebook.com/HTKNPageOfficielle"
              target="_blank"
              className="contribute-link"
            >
              Page Facebook
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/jTWcmQM"
              target="_blank"
              className="contribute-link"
            >
              Serveur Discord
            </a>
          </li>
          <li>
            <a
              href="#" 
              className="contribute-link"
              onClick={(e) => {
                e.preventDefault();
                window.location.href =
                  "mailto:" + "contact" + "@" + "juliendebaz.ch";
              }}
            >
              Contacter le développeur
            </a>
          </li>
        </ul>
        <p>Merci d'avance pour votre contribution!</p>
      </div>
    </div>
  );
}
