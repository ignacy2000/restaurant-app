import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1 dark:text-white">Resetowanie hasła</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Podaj adres e-mail — wyślemy Ci link do ustawienia nowego hasła</p>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
