import { Card, Stack, Text, Title } from '../../../shared/components'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <Stack align="center" justify="center" className="py-16 px-4">
      <Card className="w-full max-w-md p-10">
        <Stack gap={8}>
          <Stack gap={1}>
            <Title level={1} size="xl">Rejestracja</Title>
            <Text size="sm" tone="muted">Utwórz nowe konto</Text>
          </Stack>
          <RegisterForm />
        </Stack>
      </Card>
    </Stack>
  )
}
