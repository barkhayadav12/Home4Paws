import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaMapMarkerAlt, FaMapMarkedAlt } from 'react-icons/fa';


const NGOS = [
  {
    id: 1,
    name: "Helping Hands NGO",
    description:
      "Trusted pet helpers committed to providing timely aid and support for pets in need. When you request help, we’re ready to respond with care and compassion.",
    address: "123 Relief Street, Hope City",
  },
  {
    id: 2,
    name: "Safe Paws Foundation",
    description:
      "Dedicated to rescuing and rehabilitating stray animals, providing shelter and medical care to those in need.",
    address: "456 Care Avenue, Kind Town",
  },
];

export default function RequestHelp({ loggedInUserEmail }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [form, setForm] = useState({ message: '', address: '' });
  const [status, setStatus] = useState(null);

  const openModalForNGO = (ngo) => {
    setSelectedNGO(ngo);
    setForm({ message: '', address: '' });
    setStatus(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/help/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          ngoName: selectedNGO.name,
          message: form.message,
          address: form.address,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setForm({ message: '', address: '' });
        setShowModal(false);
        setStatus('Help request sent successfully.');
      } else {
        toast.error(result.message);
        setStatus('Failed to send help request.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
      setStatus('Something went wrong.');
      console.error(error);
    }
  };

  return (
    <>
      <style>{`
        .ngo-section {
          padding: 2rem 1rem;
          background: #eef4fa;
        }

        .ngo-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .ngo-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e90ff;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .card-custom {
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          max-width: 520px;
          width: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-title-custom {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .card-text-custom {
          color: #555;
          margin: 1rem 0;
          font-size: 1.05rem;
        }

        .address-text {
          font-size: 0.95rem;
          color: #34495e;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .btn-request {
          background: #1e90ff;
          color: white;
          font-weight: 600;
          padding: 0.6rem 1.5rem;
          border-radius: 30px;
          border: none;
          align-self: flex-start;
          transition: background 0.3s ease;
        }

        .btn-request:hover {
          background: #167ac6;
        }

        .modal-content-custom {
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          padding: 2rem;
        }

        .modal-header-custom {
          border-bottom: none;
          font-weight: 700;
          font-size: 1.5rem;
          color: #1e90ff;
        }

        .form-control {
          font-size: 1rem;
          border-radius: 8px;
        }

        .modal-footer {
          border-top: none;
        }
      `}</style>

      <div className="ngo-section">
        <div className="ngo-header">
          <h1>Available NGOs</h1>
          <p className="text-secondary">Reach out for help from trusted pet support organizations.</p>
        </div>

        <div className="cards-container">
          {NGOS.map((ngo) => (
            <div key={ngo.id} className="card card-custom">
              <div>
                <h2 className="card-title-custom">{ngo.name}</h2>
                <p className="card-text-custom">{ngo.description}</p>
                <p className="address-text">
                  <FaMapMarkedAlt className="me-2 text-primary" />
                  {ngo.address}
                </p>
              </div>
              <button
                className="btn-request"
                onClick={() => openModalForNGO(ngo)}
              >
                Request Help
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedNGO && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h5 className="modal-title">Request Help from {selectedNGO.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      <FaEnvelope className="me-2 text-primary" />
                      Describe Your Situation
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="4"
                      required
                      placeholder="Explain your issue..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      Your Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      required
                      placeholder="Enter your address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                  {status && <div className="alert alert-info">{status}</div>}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
