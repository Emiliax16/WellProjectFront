import { useAuth } from '../context/AuthContext'
import { FaCat } from "react-icons/fa";

function Admin() {
  const { user, login, logout } = useAuth()

  const testLoginFunction = async () => {
    console.log('trying to log in');
    await login('jpoezi@gmail.com', 'micontraentextoplano')
    console.log(`logged in`);
  }


  return (
    <div>
      <div className='bg-indigo-700 text-xl text-center text-slate-200'>This should be protected </div>
      {
        user ? 
          <div className='bg-green-500 text-white p-2'>Welcome {user.name}</div> : 
          <div className='flex justify-center items-center'>
            <FaCat className='animate-spin text-orange-300 text-2xl m-2'/>
          </div>
      }
      <button onClick={testLoginFunction} className='p-2 bg-green-500 text-white'>Login</button>
      <button onClick={logout} className='p-2 bg-red-500 text-white'>Logout</button>
    </div>
  )
}

export default Admin