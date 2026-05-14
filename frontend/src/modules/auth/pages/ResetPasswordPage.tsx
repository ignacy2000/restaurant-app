import { Card, Stack, Text, Title } from '../../../shared/components'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

export function ResetPasswordPage() {
  return (
    <Stack align="center" justify="center" className="py-16 px-4">
      <Card className="w-full max-w-md p-10">
        <Stack gap={8}>
          <Stack gap={1}>
            <Title level={1} size="xl">Nowe hasło</Title>
            <Text size="sm" tone="muted">Wpisz nowe hasło dla swojego konta</Text>
          </Stack>
          <ResetPasswordForm />
        </Stack>
      </Card>
    </Stack>
  )
}
