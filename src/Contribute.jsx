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
            <li><a href="https://www.facebook.com/HTKNPageOfficielle" className="contribute-link">Page Facebook</a></li>
            <li><a href="https://discord.gg/jTWcmQM" className="contribute-link">Serveur Discord</a></li>
            <li><a href="mailto:contact@juliendebaz.ch?subject=Chronologie HTKN" className="contribute-link">Envoyer un email au développeur</a></li>
        </ul>
        <p>Merci d'avance pour votre contribution!</p>
      </div>
    </div>
  );
}
