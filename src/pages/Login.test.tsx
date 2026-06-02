import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByText('Vant Admin')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('用户名: admin 或任意字符')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登 录/ })).toBeInTheDocument()
  })
})
