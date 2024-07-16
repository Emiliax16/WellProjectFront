import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { FaCat } from "react-icons/fa";

function Admin() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()


  return (
    <div>
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

      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={logout} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Logout</button>
      </div>

    </div>
  )
}

export default Admin