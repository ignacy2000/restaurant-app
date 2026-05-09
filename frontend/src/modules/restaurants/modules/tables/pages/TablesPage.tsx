import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTables } from '../hooks/useTables'
import { TableCard } from '../components/TableCard'
import { AddTableForm } from '../components/AddTableForm'
import { Alert } from '../../../../../shared/components/Alert'
import { Button } from '../../../../../shared/components/Button'
import { EmptyState } from '../../../../../shared/components/EmptyState'
import { Spinner } from '../../../../../shared/components/Spinner'
import type { CreateTableReq } from '../types/table.types'

export function TablesPage() {
  const { id } = useParams<{ id: string }>()
  const { tables, loading, error, create, updateCapacity, remove } = useTables(id!)
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(data: CreateTableReq) {
    await create(data)
    setShowForm(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold dark:text-white">Stoliki</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Dodaj stolik</Button>
        )}
      </div>

      {showForm && (
        <AddTableForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : tables.length === 0 && !showForm ? (
        <EmptyState
          icon="🪑"
          title="Brak stolików"
          description="Dodaj pierwsze stoliki, aby goście mogli składać zamówienia i wzywać obsługę."
          action={<Button size="lg" onClick={() => setShowForm(true)}>+ Dodaj pierwszy stolik</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              restaurantId={id!}
              onUpdateCapacity={(tableId, capacity) => updateCapacity(tableId, { capacity })}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </>
  )
}
