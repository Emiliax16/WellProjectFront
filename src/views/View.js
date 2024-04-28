import { useAuth } from '../context/AuthContext'

function View() {

  const { user } = useAuth()

  return (
    <div>
      <div className='bg-indigo-700 text-xl text-center text-slate-200'>This should be protected </div>
      {
        user ? 
          <div className='bg-green-500 text-white p-2'>Welcome {user.name}</div> : 
          <div> You are not logged in </div>
      }
    </div>

  )
}

export default View