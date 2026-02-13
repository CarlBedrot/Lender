import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('should render children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply base card class', () => {
    render(<Card>Content</Card>);
    const card = screen.getByText('Content').closest('.card') || screen.getByText('Content');
    expect(card).toHaveClass('card');
  });

  it('should accept additional className', () => {
    render(<Card className="custom-class">Content</Card>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });

  it('should handle click events when onClick is provided', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);

    await user.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply hover styles when hoverable is true', () => {
    render(<Card hoverable>Hoverable Card</Card>);
    const card = screen.getByText('Hoverable Card');
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('hover:bg-lender-card-hover');
  });

  it('should not apply hover styles when hoverable is false', () => {
    render(<Card>Static Card</Card>);
    const card = screen.getByText('Static Card');
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('should render complex children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
