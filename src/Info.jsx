import "./modal.css";

export default function Info({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          x
        </button>
        <h2>Kézako?</h2>
        <p>
          Bienvenue sur la chronologie historique de la team HTKN. Elle retrace
          les évènements de la team depuis sa création.
        </p>
        <p>
          La liste des évènements proposée ici est bien entendu non exaustive!
          Elle respose sur des traces écrites sur internet, des captures
          d'écran, des souvenirs des membres. C'est pourquoi, par exemple,
          toutes les dates d'entrée des différents membres n'y figurent pas.
        </p>
        <p>
          Si vous souhaitez contribuer à cette chronologie en partageant vos
          souvenirs, vos captures d'écran, vos enregistrements, cliquez sur le
          bouton "Contribuer" en haut de la page.
        </p>
        <p>Bonne lecture!</p>
        <div className="info-footer">
          <p className="copyright">Créé et maintenu par [HTKN]ToxxicZad</p>
          <p className="copyright">2025 - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
