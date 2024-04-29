import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

function Home() {
  const { login, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login('easy@gmail.com', 'hola')
    // await login('jpoezi2@gmail.com', 'micontraentextoplano')
    navigate('/admin')
  }


  return (
    <div>
    <div className='bg-indigo-700 text-xl text-center text-slate-200'>This is the main page </div>
    {
      user ?
        <div>
          <div className='bg-green-500 text-white p-2'>Welcome {user.name} ({user.roleId === 1 ? 'admin' : 'regular'})</div>
          <div className='flex justify-start'>
            <button onClick={logout} className='p-2 bg-orange-600 text-white min-w-full'>Logout</button>
          </div>
        </div>
         :
        <div className='flex min-w-full'>
          <button onClick={handleLogin} className='p-2 bg-green-500 text-white min-w-full'>Login</button>
        </div>
    }
            
    </div>
  );
}

export default Home;
