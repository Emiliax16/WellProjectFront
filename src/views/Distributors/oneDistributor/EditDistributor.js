import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import useLoading from "../../../hooks/useLoading";
import useError from "../../../hooks/useError";
import Alerts from "../../../components/Alerts";
import { getDistributorDetailsById } from "../../../services/distributorService";
import DistributorForm from "../../../components/distributorForm";

function EditDistributor() {
  const { id: distributorId } = useParams();
  const [cookies] = useCookies(["token"]);
  const [distributor, setDistributor] = useState(null);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [distributorInfo, setDistributorInfo] = useState(null);

  const fetchDistributor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const distributorDetails = await getDistributorDetailsById(
        cookies.token,
        distributorId
      );
      if (!distributorDetails) throw new Error("No distributor data available");
      setDistributor(distributorDetails);
    } catch (err) {
      setError(
        "No se puede editar el distributor porque hay un error obteniendo los datos: " +
          err.message
      );
    } finally {
      setLoading(false);
    }
  }, [cookies.token, distributorId, setLoading, setError]);

  useEffect(() => {
    fetchDistributor();
  }, [fetchDistributor]);

  useEffect(() => {
    if (distributor) {
      setDistributorInfo({
        id: distributorId,
        name: distributor.user.name,
        distributorRut: distributor.distributorRut,
        distributorLogo: distributor.distributorLogo,
        location: distributor.location,
        phoneNumber: distributor.phoneNumber,
        isActived: distributor.user.isActived,
        roleId: distributor.user.roleId,
        roleType: distributor.role,
        email: distributor.user.email,
        recoveryEmail: distributor.recoveryEmail,
      });
    }
  }, [distributor, distributorId]);

  return (
    <div>
      {loading ? (
        <div>{loadingIcon}</div>
      ) : distributorInfo ? (
        <DistributorForm distributorInfo={distributorInfo} />
      ) : error ? (
        <Alerts type="error" message={error} />
      ) : (
        <div>No hay datos</div>
      )}
    </div>
  );
}

export default EditDistributor;
