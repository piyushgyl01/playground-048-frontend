import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/pcs`
  );

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this PC?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pcs/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>PCs List</h2>
        <Link to="/post" className="btn btn-success">
          Add New PC
        </Link>
      </div>

      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="alert alert-info">No PCs found. Add your first PC!</div>
      )}

      <div className="row">
        {data &&
          data.map((pc) => (
            <div className="col-md-12 mb-4 list-group" key={pc._id}>
              <div className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">
                    {pc.buildName} by {pc.buidler} for {pc.price}
                  </h5>
                  <small className="text-body-secondary">
                    {new Date(pc.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Link
                  to={`/details/${pc._id}`}
                  className="btn btn-primary me-2 mt-2"
                >
                  View Details
                </Link>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleDelete(pc._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
