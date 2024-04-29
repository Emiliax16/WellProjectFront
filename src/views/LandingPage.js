import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const GoToLogin = async () => {
    navigate('/login')
  }


  return (
    <div>
      <div className='flex min-w-full'>
        <button onClick={GoToLogin} className='p-2 bg-green-500 text-white min-w-full'>BEST LANDING PAGE DEL WORLD, VAMOS A LOGEARNOS</button>
      </div>
            
    </div>
  );
}

export default LandingPage;
