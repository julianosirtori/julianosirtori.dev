import { render, screen } from '@testing-library/react'

import { Header } from "./Header";

describe("Header", () => {
  it('renders a heading', () => {
    render(<Header />)

    const heading = screen.getByRole('heading', { name: /Header/i })

    expect(heading).toBeInTheDocument()
  })
})