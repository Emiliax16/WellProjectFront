import UserForm from '../../../components/userForm';
import { useLocation } from 'react-router-dom';

function NewClient() {
  const location = useLocation();
  const { createdFromCompany, companyId } = location.state || {};

  return (
    <UserForm createdFromCompany={createdFromCompany} companyId={companyId} />
  )
}

export default NewClient