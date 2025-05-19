import CompanyForm from '../../../components/companyForm';
import { useLocation } from 'react-router-dom';

function NewCompany() {
  console.log("entre aca new company")
  const location = useLocation();
  const { createdFromDistributor, distributorId } = location.state || {};

  return (
    <CompanyForm createdFromDistributor={createdFromDistributor} distributorId={distributorId} />
  )
}

export default NewCompany
