import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { deleteClientById } from '../../../services/clientServices'
import { useCookies } from 'react-cookie'
import useError from '../../../hooks/useError'
import { useAuth } from '../../../context/AuthContext'
import { clientFront, companyFront } from '../../../utils/routes.utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { AlertTriangle, Lock, Trash2, X, AlertCircle } from 'lucide-react'

function DeleteClient() {
  const { id: clientId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const { error, setError } = useError()
  const [password, setPassword] = useState('')
  const [cookies] = useCookies(['token'])
  const { isCompany } = useAuth()
  const { companyId } = location.state || {}

  // Client model only has userId, no name field

  const handleDeleteClient = async (e) => {
    e.preventDefault()
    const requiredPassword = process.env.REACT_APP_DELETE_PASSWORD

    if (password === requiredPassword) {
      try {
        setLoading(true)
        setError(null)
        await deleteClientById(cookies.token, clientId)
        if (isCompany) {
          navigate(`/${companyFront.urlCompanies}/${companyId}/${clientFront.urlClients}`)
        } else {
          navigate(`/${clientFront.urlClients}`)
        }
      } catch (err) {
        setError('No se pudo eliminar al cliente: ' + err.message)
      } finally {
        setLoading(false)
      }
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleCancel = () => {
    if (isCompany) {
      navigate(`/${companyFront.urlCompanies}/${companyId}/${clientFront.urlClients}`)
    } else {
      navigate(`/${clientFront.urlClients}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <Card className="w-full max-w-lg mx-4 shadow-2xl border-destructive">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-2xl">Eliminar Cliente</CardTitle>
                <CardDescription className="mt-1">Esta acción no se puede deshacer</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning Message */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-destructive">¿Estás seguro de que deseas eliminar este cliente?</p>
                <p className="text-muted-foreground">
                  Este cliente y todos sus datos asociados (pozos y reportes) serán eliminados permanentemente.
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleDeleteClient} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Ingresa la contraseña de confirmación
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Contacta al administrador si no conoces la contraseña
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={loading || !password}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeleteClient
