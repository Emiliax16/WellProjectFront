import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import useLoading from "../../../hooks/useLoading";
import useError from "../../../hooks/useError";
import Alerts from "../../../components/Alerts";
import { getAllDistributors } from "../../../services/distributorService";
import DistributorRow from "./DistributorRow";

function DistributorList() {
  const [distributors, setDistributors] = useState([]);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [cookies] = useCookies(["token"]);

  const getDistributors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const distributors = await getAllDistributors(cookies.token);
      setDistributors(distributors);
    } catch (error) {
      console.log("Error fetching companies", error);
      setError("Error al cargar las empresas");
    } finally {
      setLoading(false);
    }
  }, [cookies.token, setLoading, setError]);

  const thStyle =
    "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider";

  useEffect(() => {
    getDistributors();
  }, [getDistributors]);

  return (
    <div>
      <div className="bg-green-500 text-white p-2">
        Welcome to the distributors view
      </div>
      <div className="flex justify-center items-center">
        {loading ? (
          <div>{loadingIcon}</div>
        ) : error ? (
          <Alerts type="error" message={error} />
        ) : (
          <div className="bg-white p-2 m-2 min-w-full">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className={thStyle}>Distributor Name</th>
                  <th className={thStyle}>Distributor Status</th>
                  <th className={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {distributors.map((distributor) => (
                  <DistributorRow
                    key={distributor.id}
                    distributor={distributor}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DistributorList;
