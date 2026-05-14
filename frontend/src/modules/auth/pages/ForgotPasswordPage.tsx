import { Card, Stack, Text, Title } from '../../../shared/components'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <Stack align="center" justify="center" className="py-16 px-4">
      <Card className="w-full max-w-md p-10">
        <Stack gap={8}>
          <Stack gap={1}>
            <Title level={1} size="xl">Resetowanie hasła</Title>
            <Text size="sm" tone="muted">Podaj adres e-mail — wyślemy Ci link do ustawienia nowego hasła</Text>
          </Stack>
          <ForgotPasswordForm />
        </Stack>
      </Card>
    </Stack>
  )
}
