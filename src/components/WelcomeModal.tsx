import './WelcomeModal.scss';

type WelcomeModalProps = {
  setOpen: (open: boolean) => void;
};

export const WelcomeModal = (props: WelcomeModalProps) => {
  const { setOpen } = props;

  const setDontShowAgain = (dontShowAgain: boolean) => {
    localStorage.setItem('kovacsik-military-real-time-map-welcome', JSON.stringify(dontShowAgain));
  }

  return (
    <div id="WelcomeModal">
      <div className="modal-content">
        <h2 className="modal-title">Welcome to my Real Time Map</h2>
        <p className="modal-message">
          This real time map is designed to provide you with the latest information about the current state of the battlefield.
          <br /><br />
          Real time position updates are provided by the Command Center, which is a mock server that simulates real time data. Positions use real world speed.
        </p>
        <div className='modal-panels'>
          <div>Select an icon to view it's data</div>
        </div>
        <div className='modal-footer'>
          <div className="modal-checkbox">
            <label>
              <input
                type="checkbox"
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              Don't show this again
            </label>
          </div>
          <button className="modal-close-button" onClick={() => setOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};
