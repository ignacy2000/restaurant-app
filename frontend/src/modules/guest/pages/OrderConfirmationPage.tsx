import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ordersApi } from '../../restaurants/modules/orders/services/orders.api'
import type { ConfirmOrderResponse } from '../../restaurants/modules/orders/services/orders.api'
import { Spinner } from '../../../shared/components/Spinner'

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<ConfirmOrderResponse | null>(null)
  const calledRef = useRef(false)

  useEffect(() => {
    if (!token) { setState('error'); return }
    if (calledRef.current) return
    calledRef.current = true

    ordersApi.confirmOrder(token)
      .then(res => { setData(res); setState('success') })
      .catch(() => setState('error'))
  }, [token])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <span className="text-5xl block mb-4">⚠️</span>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link nieprawidłowy lub wygasł</h1>
          <p className="text-sm text-gray-500">
            Link do potwierdzenia jest jednorazowy i ważny przez 1 godzinę.
            Wróć do stolika i złóż zamówienie ponownie.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center flex flex-col gap-4">
        <span className="text-5xl">✅</span>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">Zamówienie potwierdzone!</h1>
          <p className="text-sm text-gray-500">
            Twoje zamówienie trafiło do kuchni. Możesz śledzić jego status na stronie stolika.
          </p>
        </div>
        {data && (
          <Link
            to={`/table/${data.restaurant_id}/${data.table_id}`}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl transition hover:bg-blue-700 text-sm"
          >
            Śledź status zamówienia →
          </Link>
        )}
      </div>
    </div>
  )
}
