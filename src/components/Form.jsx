import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Form({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buildName: "",
    price: "",
    buidler: "",
  });

  const [apiError, setApiError] = useState(null);

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/pcs/${id}`
  );

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        buildName: data?.buildName || "",
        price: data?.price || "",
        buidler: data?.buidler || "",
      });
    }
  }, [isEdit, data, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);

    try {
      if (isEdit) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pcs/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          navigate(`/details/${id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to update startup");
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pcs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const createdPc = await response.json();
          navigate(`/details/${createdPc._id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to create new startup");
        }
      }
    } catch (error) {
      console.log(error);
      setApiError("Network error occurred");
    }
  }
  return (
    <>
      {isEdit && loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">
              {isEdit ? "Edit PC" : "Add New PC"}
            </h2>

            {(error || apiError) && (
              <div className="d-flex justify-content-center align-items-center">
                <div className="alert alert-danger">{error || apiError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="buildName" className="form-label">
                  Build Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="buildName"
                  id="buildName"
                  placeholder="e.g., Budget Blaster"
                  value={formData.buildName}
                  onChange={(e) =>
                    setFormData({ ...formData, buildName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <textarea
                  className="form-control"
                  name="price"
                  id="price"
                  placeholder="e.g., $649"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  rows={8}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="buidler" className="form-label">
                  Buidler
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="buidler"
                  id="buidler"
                  placeholder="e.g., PC_Patriot"
                  value={formData.buidler}
                  onChange={(e) =>
                    setFormData({ ...formData, buidler: e.target.value })
                  }
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <Link
                  to={isEdit ? `/details/${id}` : "/"}
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Save Changes" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
