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
        <div className="contact">
          <a
            href="https://www.facebook.com/HTKNPageOfficielle"
            target="_blank"
            rel="noopener noreferrer"
            className="contribute-link facebook"
          >
            Facebook
          </a>
          <a
            href="https://discord.gg/jTWcmQM"
            target="_blank"
            rel="noopener noreferrer"
            className="contribute-link discord"
          >
            Discord
          </a>
          <a
            href="#"
            className="contribute-link email"
            onClick={(e) => {
              e.preventDefault();
              window.location.href =
                "mailto:" + "contact" + "@" + "juliendebaz.ch";
            }}
          >
            Email
          </a>
        </div>
        <p>Merci d'avance pour votre contribution!</p>
      </div>
    </div>
  );
}
