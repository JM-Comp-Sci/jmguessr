import { useState } from "react";

export default function GameUI({ loc }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marker, setMarker] = useState(null);  // Allow only one marker

  const handleMapClick = (e) => {

    const rect = e.target.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const percentX = (xPx / rect.width) * 100;
    const percentY = (yPx / rect.height) * 100;
    setMarker({
      x: xPx+35,
      y: yPx+85,
      percentX,
      percentY,
    });

    console.log(`Clicked at ${percentX}%, ${percentY}%`);


  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={"/first.png"}
          alt="Game"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            width: '80%',
            padding: '1rem',
            fontSize: '1.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px',
            margin: '0 auto',
            display: 'block',
          }}
        >
          Start Guessing
        </button>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >

          <div
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '90%',
              textAlign: 'center',
              position: 'relative',
              width: '80%',
              height: '80%',
            }}
          >
                    <h1 style={{ color: '#000', fontSize: '2rem', marginBottom: '1rem' }}>
            Guess the location
          </h1>
            <div
              style={{
                width: '100%',
                height: '66vh',
                maxWidth: '1000px',
                maxHeight: '1000px',

              }}
            >
              <div style={{
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                // width: '100%',
                // height: '100%',
              }}>
              <img
              src="/ground.png"
              alt="Map"
              style={{
                width: '100%',
                objectFit: 'contain',
              }}
              onClick={handleMapClick}
            />
            </div>
          {marker && (
            <div
              style={{
                position: 'absolute',
                top: marker.y,
                left: marker.x,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img
                src="/src.png"
                alt="Marker"
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}

            </div>
            <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
              {marker && <button
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '1.2rem',
                  paddingLeft: '2rem',
                  paddingRight: '2rem',

                }}
              >
                Submit
              </button>}
              &nbsp;&nbsp;
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '1.2rem',
                  paddingLeft: '2rem',
                  paddingRight: '2rem',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
