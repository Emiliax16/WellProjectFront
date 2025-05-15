import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { getDistributorDetailsById } from "../../../services/distributorService";
import { useAuth } from "../../../context/AuthContext";
import useLoading from "../../../hooks/useLoading";
import useError from "../../../hooks/useError";
import Alerts from "../../../components/Alerts";
import DistributorDetailsText from "../../../texts/Distributors/oneDistributor/DistributorDetailsText.json";

function DistributorDetails() {
  const { id: distributorId } = useParams();
  const [distributor, setDistributor] = useState(null);
  const { isAdmin, isCompany } = useAuth();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();

  const handleSeeCompanies = () => {
    navigate(`/distributors/${distributorId}/companies`);
  };

  const handleCreateCompanies = () => {
    navigate("/companies/new", {
      state: { createdFromDistributor: true, distributorId: distributorId },
    });
  };

  const fetchDistributorDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const distributorDetails = await getDistributorDetailsById(
        cookies.token,
        distributorId
      );
      if (!distributorDetails)
        throw new Error(DistributorDetailsText.alerts.noData);
      setDistributor(distributorDetails);
    } catch (err) {
      console.log(err.message);
      setError(DistributorDetailsText.alerts.error);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, distributorId, setLoading, setError]);

  useEffect(() => {
    fetchDistributorDetails();
  }, [fetchDistributorDetails]);

  return (
    <div>
      <div className="bg-green-500 text-white p-2">
        {DistributorDetailsText.titles.principalTitle}
      </div>
      <div className="flex justify-center items-center">
        {loading ? (
          <div>{loadingIcon}</div>
        ) : (
          <div className="bg-white p-2 m-2">
            {!error && distributor ? (
              <>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.name}{" "}
                  {distributor.user.name}
                </div>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.rut}{" "}
                  {distributor.distributorRut}
                </div>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.email}{" "}
                  {distributor.user.email}
                </div>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.logoUrl}{" "}
                  {distributor.distributorLogo}
                </div>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.location}{" "}
                  {distributor.location}
                </div>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.phone}{" "}
                  {distributor.phoneNumber}
                </div>
                <div className="text-lg font-semibold">
                  {DistributorDetailsText.attributes.recoveryEmail}{" "}
                  {distributor.recoveryEmail}
                </div>
                {(isAdmin || isCompany) && (
                  <>
                    <button
                      onClick={handleCreateCompanies}
                      className="p-2 my-5 bg-blue-500 text-white rounded-md"
                    >
                      {DistributorDetailsText.buttons.createCompany}
                    </button>
                    <br></br>
                    <button
                      onClick={handleSeeCompanies}
                      className="p-2 bg-blue-500 text-white rounded-md"
                    >
                      {DistributorDetailsText.buttons.seeCompanies}
                    </button>
                  </>
                )}
              </>
            ) : (
              <Alerts type="error" message={error} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DistributorDetails;
