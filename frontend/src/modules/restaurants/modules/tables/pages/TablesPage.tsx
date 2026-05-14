import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTables } from '../hooks/useTables'
import { TableCard } from '../components/TableCard'
import { AddTableForm } from '../components/AddTableForm'
import {
  Alert,
  Button,
  EmptyState,
  Grid,
  Spinner,
  Stack,
  Title,
} from '../../../../../shared/components'
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
      <Stack direction="row" align="center" justify="between" className="mb-8">
        <Title level={1} size="lg">Stoliki</Title>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Dodaj stolik</Button>
        )}
      </Stack>

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
        <Grid cols={1} responsive={{ sm: 2, lg: 3, xl: 4 }} gap={4}>
          {tables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              restaurantId={id!}
              onUpdateCapacity={(tableId, capacity) => updateCapacity(tableId, { capacity })}
              onDelete={remove}
            />
          ))}
        </Grid>
      )}
    </>
  )
}
