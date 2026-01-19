import WellForm from '../../../components/wellForm'
import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import useError from '../../../hooks/useError'
import { Card, CardContent } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

function EditWell() {
  const [well, setWell] = useState(null)
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()

  const fetchWell = useCallback(
    async (wellSend) => {
      setLoading(true)
      setError(null)
      try {
        if (!wellSend) throw new Error('No se encontraron datos del pozo')
        setWell(wellSend.well)
      } catch (err) {
        setError('No se puede editar el pozo porque hay un error obteniendo los datos: ' + err.message)
      } finally {
        setLoading(false)
      }
    },
    [setError]
  )

  useEffect(() => {
    if (location.state) {
      fetchWell(location.state)
    } else {
      setError('No se recibieron datos del pozo')
      setLoading(false)
    }
  }, [location.state, fetchWell, setError])

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!well) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">No hay datos del pozo disponibles</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <WellForm well={well} />
}

export default EditWell
