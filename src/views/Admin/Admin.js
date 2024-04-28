import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { FaCat } from "react-icons/fa";

function Admin() {
  const navigate = useNavigate()
  const { user } = useAuth()


  return (
    <div>
      <div className='bg-indigo-700 text-xl text-center text-slate-200'>This should be protected </div>
      {
        user ? 
          <div className='bg-green-500 text-white p-2'>Welcome {user.name} ({user.roleId === 1 ? 'admin' : 'regular'})</div> : 
          <div className='flex justify-center items-center'>
            <FaCat className='animate-spin text-orange-300 text-2xl m-2'/>
          </div>
      }

      <div className='flex justify-start'>
        <button className='p-2 bg-pink-500 text-white' onClick={()=>{navigate('/clients/new')}}>
          Crear un cliente
        </button>
        <button className='p-2 bg-cyan-400 text-white' onClick={()=>{navigate('/clients')}}>
          Ver clientes
        </button>
      </div>

    </div>
  )
}

export default Admin