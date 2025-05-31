import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Donate() {
  const [form, setForm] = useState({
    name: '',
    breed: '',
    gender: '',
    age: '',
    address: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageFile) formData.append('image', imageFile);

      await axios.post('http://localhost:5000/api/pets/add', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Pet listed for adoption!");
      setForm({ name: '', breed: '', gender: '', age: '', address: '' });
      setImageFile(null);
      setPreview(null);
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || "Error listing pet");
    }
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f6fa;
        }
        .donate-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
        }
        .donate-card {
          background-color: #ffffff;
          padding: 30px 40px;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          border: 1px solid #dce1e7;
        }
        .donate-card h2 {
          text-align: center;
          margin-bottom: 25px;
          font-size: 28px;
          font-weight: 600;
          color: #333;
        }
        .form-control {
          font-size: 16px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 15px;
        }
        .form-control:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }
        .btn-submit {
          background-color: #007bff;
          color: #fff;
          padding: 10px 18px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          width: 100%;
          transition: background-color 0.3s ease;
        }
        .btn-submit:hover {
          background-color: #0056b3;
        }
        .preview-img {
          display: block;
          margin: 15px auto;
          border-radius: 8px;
          max-width: 100%;
          height: auto;
        }
      `}</style>

      <div className="donate-container">
        <div className="donate-card">
          <h2>List a Pet for Adoption</h2>
          <form onSubmit={handleSubmit}>
            {["name", "breed", "gender", "age", "address"].map((field) => (
              <input
                key={field}
                type={field === "age" ? "number" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="form-control"
                value={form[field]}
                onChange={handleChange}
                required
              />
            ))}

            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
              required
            />

            {preview && <img src={preview} alt="Preview" className="preview-img" />}

            <button type="submit" className="btn-submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
