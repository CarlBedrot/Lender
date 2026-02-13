import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  it('should render a select element', () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<Select options={defaultOptions} label="Choose an option" />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should render error message when provided', () => {
    render(<Select options={defaultOptions} error="Selection is required" />);
    expect(screen.getByText('Selection is required')).toBeInTheDocument();
  });

  it('should apply error styling when error is present', () => {
    render(<Select options={defaultOptions} error="Error" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
  });

  it('should handle selection changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option2');

    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue('option2');
  });

  it('should have correct initial value', () => {
    render(<Select options={defaultOptions} value="option2" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select options={defaultOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should apply base input class', () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('input');
  });

  it('should accept additional className', () => {
    render(<Select options={defaultOptions} className="custom-select" />);
    expect(screen.getByRole('combobox')).toHaveClass('custom-select');
  });
});
