import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Inbox
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'
import { cn } from '../lib/utils'

export function DataTable({
  data = [],
  columns = [],
  title,
  description,
  searchPlaceholder = 'Buscar...',
  loading = false,
  emptyState,
  actions = {
    view: true,
    edit: true,
    delete: true,
  },
  getRowActions,
  itemsPerPage = 10,
}) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    if (!searchQuery) return data

    return data.filter((item) =>
      columns.some((column) => {
        const value = column.accessorFn ? column.accessorFn(item) : item[column.accessorKey]
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      })
    )
  }, [data, searchQuery, columns])

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.accessorKey === sortConfig.key)
      const aValue = column.accessorFn ? column.accessorFn(a) : a[sortConfig.key]
      const bValue = column.accessorFn ? column.accessorFn(b) : b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig, columns])

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Loading state
  if (loading) {
    return (
      <Card className="card-premium border-0">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <Card className="card-premium border-0">
        <CardHeader>
          {title && <CardTitle className="text-2xl">{title}</CardTitle>}
          {description && <CardDescription className="text-base">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {emptyState?.title || 'No hay datos'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {emptyState?.description || 'No se encontraron registros para mostrar'}
            </p>
            {emptyState?.action && (
              <Button onClick={emptyState.action.onClick}>
                {emptyState.action.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-premium border-0">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            {title && <CardTitle className="text-2xl">{title}</CardTitle>}
            {description && <CardDescription className="text-base">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {sortedData.length} {sortedData.length === 1 ? 'registro' : 'registros'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column) => (
                  <TableHead key={column.accessorKey} className={cn(column.className)}>
                    {column.sortable !== false ? (
                      <button
                        onClick={() => handleSort(column.accessorKey)}
                        className="flex items-center gap-2 hover:text-foreground transition-colors font-semibold"
                      >
                        {column.header}
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span className="font-semibold">{column.header}</span>
                    )}
                  </TableHead>
                ))}
                {(actions.view || actions.edit || actions.delete) && (
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No se encontraron resultados para "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => {
                  const rowActions = getRowActions ? getRowActions(item) : null
                  return (
                    <TableRow key={index} className="group">
                      {columns.map((column) => (
                        <TableCell key={column.accessorKey} className={cn(column.className)}>
                          {column.cell
                            ? column.cell(item)
                            : column.accessorFn
                            ? column.accessorFn(item)
                            : item[column.accessorKey]}
                        </TableCell>
                      ))}
                      {(actions.view || actions.edit || actions.delete) && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {actions.view && rowActions?.view && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(rowActions.view)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {actions.edit && rowActions?.edit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(rowActions.edit)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {actions.delete && rowActions?.delete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(rowActions.delete)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de{' '}
              {sortedData.length} resultados
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  // Mostrar solo páginas cercanas a la actual
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => handlePageChange(page)}
                        className="h-8 w-8"
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
