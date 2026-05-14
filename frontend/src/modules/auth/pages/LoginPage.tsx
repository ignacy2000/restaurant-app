import { Card, Stack, Text, Title } from '../../../shared/components'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <Stack align="center" justify="center" className="py-16 px-4">
      <Card className="w-full max-w-md p-10">
        <Stack gap={8}>
          <Stack gap={1}>
            <Title level={1} size="xl">Zaloguj się</Title>
            <Text size="sm" tone="muted">Witaj z powrotem — wpisz swoje dane</Text>
          </Stack>
          <LoginForm />
        </Stack>
      </Card>
    </Stack>
  )
}
