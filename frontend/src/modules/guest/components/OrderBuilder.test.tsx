import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderBuilder } from './OrderBuilder'
import type { MenuItem } from '../../restaurants/modules/menus'

const mockGetItems = vi.fn()

vi.mock('../../restaurants/modules/menus', () => ({
  menusApi: { getItemsByRestaurant: (...args: unknown[]) => mockGetItems(...args) },
}))

vi.mock('../../../shared/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}))

const MENU: MenuItem[] = [
  { id: '1', menu_id: 'm1', name: 'Zupa', description: 'Klasyczna', price: 12.5, position: 1 },
  { id: '2', menu_id: 'm1', name: 'Pierogi', description: '', price: 18, position: 2 },
]

beforeEach(() => {
  vi.clearAllMocks()
})

function renderBuilder(onSubmit = vi.fn()) {
  return render(<OrderBuilder restaurantId="r1" onSubmit={onSubmit} />)
}

describe('OrderBuilder', () => {
  describe('loading / empty states', () => {
    it('shows spinner while fetching menu', () => {
      mockGetItems.mockReturnValue(new Promise(() => {}))
      renderBuilder()
      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })

    it('shows empty menu message when no items', async () => {
      mockGetItems.mockResolvedValue([])
      renderBuilder()
      expect(await screen.findByText('Menu nie jest jeszcze skonfigurowane')).toBeInTheDocument()
    })
  })

  describe('menu rendering', () => {
    it('renders all menu items with names and prices', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()

      expect(await screen.findByText('Zupa')).toBeInTheDocument()
      expect(screen.getByText('12,50 zł')).toBeInTheDocument()
      expect(screen.getByText('Pierogi')).toBeInTheDocument()
      expect(screen.getByText('18,00 zł')).toBeInTheDocument()
    })

    it('passes restaurantId to the API', async () => {
      mockGetItems.mockResolvedValue([])
      renderBuilder()
      await waitFor(() => expect(mockGetItems).toHaveBeenCalledWith('r1'))
    })
  })

  describe('cart operations', () => {
    it('adds item to cart on click and shows quantity badge', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()
      await screen.findByText('Zupa')

      const zupaButton = screen.getByText('Zupa').closest('button')!
      await userEvent.click(zupaButton)

      expect(screen.getByText('Koszyk')).toBeInTheDocument()
      // badge inside the menu tile
      expect(within(zupaButton).getByText('1')).toBeInTheDocument()
    })

    it('increments quantity when same item clicked again', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()
      await screen.findByText('Zupa')

      const zupaButton = screen.getByText('Zupa').closest('button')!
      await userEvent.click(zupaButton)
      await userEvent.click(zupaButton)

      // badge in the tile should show 2
      expect(within(zupaButton).getByText('2')).toBeInTheDocument()
    })

    it('removes item when × button clicked', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()
      await screen.findByText('Zupa')

      await userEvent.click(screen.getByText('Zupa').closest('button')!)
      await userEvent.click(screen.getByLabelText('Usuń'))

      expect(screen.queryByText('Koszyk')).not.toBeInTheDocument()
    })

    it('removes item when quantity decremented to 0 via − button', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()
      await screen.findByText('Zupa')

      await userEvent.click(screen.getByText('Zupa').closest('button')!)
      await userEvent.click(screen.getByText('−'))

      expect(screen.queryByText('Koszyk')).not.toBeInTheDocument()
    })
  })

  describe('total price calculation', () => {
    it('shows correct total for single item', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()
      await screen.findByText('Zupa')

      await userEvent.click(screen.getByText('Zupa').closest('button')!)

      expect(screen.getByText('12,50 zł', { selector: 'span' })).toBeInTheDocument()
    })

    it('shows correct total for multiple items', async () => {
      mockGetItems.mockResolvedValue(MENU)
      renderBuilder()
      await screen.findByText('Zupa')

      await userEvent.click(screen.getByText('Zupa').closest('button')!)
      await userEvent.click(screen.getByText('Pierogi').closest('button')!)

      // 12.50 + 18.00 = 30.50
      const totals = screen.getAllByText('30,50 zł')
      expect(totals.length).toBeGreaterThan(0)
    })
  })

  describe('order submission', () => {
    it('calls onSubmit with correct items and notes', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      mockGetItems.mockResolvedValue(MENU)
      render(<OrderBuilder restaurantId="r1" onSubmit={onSubmit} />)
      await screen.findByText('Zupa')

      await userEvent.click(screen.getByText('Zupa').closest('button')!)
      await userEvent.type(
        screen.getByPlaceholderText('Uwagi do zamówienia (opcjonalnie)'),
        'bez cebuli'
      )
      await userEvent.click(screen.getByRole('button', { name: /Zamów/ }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          [{ name: 'Zupa', quantity: 1 }],
          'bez cebuli'
        )
      })
    })

    it('shows error message when submission fails', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Serwer niedostępny'))
      mockGetItems.mockResolvedValue(MENU)
      render(<OrderBuilder restaurantId="r1" onSubmit={onSubmit} />)
      await screen.findByText('Zupa')

      await userEvent.click(screen.getByText('Zupa').closest('button')!)
      await userEvent.click(screen.getByRole('button', { name: /Zamów/ }))

      expect(await screen.findByText('Serwer niedostępny')).toBeInTheDocument()
    })

    it('does not call onSubmit when cart is empty', async () => {
      mockGetItems.mockResolvedValue(MENU)
      const onSubmit = vi.fn()
      render(<OrderBuilder restaurantId="r1" onSubmit={onSubmit} />)
      await screen.findByText('Zupa')

      expect(screen.queryByRole('button', { name: /Zamów/ })).not.toBeInTheDocument()
    })
  })
})
