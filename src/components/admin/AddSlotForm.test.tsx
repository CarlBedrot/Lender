import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { AddSlotForm } from './AddSlotForm';

// Mock the useCreateSlot hook
vi.mock('../../hooks/useSlots', () => ({
  useCreateSlot: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 'new-slot' }),
    isPending: false,
  }),
}));

describe('AddSlotForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render date input', () => {
    render(<AddSlotForm />);
    expect(screen.getByLabelText(/datum/i)).toBeInTheDocument();
  });

  it('should render time input', () => {
    render(<AddSlotForm />);
    expect(screen.getByLabelText(/starttid/i)).toBeInTheDocument();
  });

  it('should render duration select', () => {
    render(<AddSlotForm />);
    expect(screen.getByLabelText(/längd/i)).toBeInTheDocument();
  });

  it('should render notes input', () => {
    render(<AddSlotForm />);
    expect(screen.getByLabelText(/anteckningar/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<AddSlotForm />);
    expect(screen.getByRole('button', { name: /lägg till tid/i })).toBeInTheDocument();
  });

  it('should have all duration options', () => {
    render(<AddSlotForm />);

    expect(screen.getByRole('option', { name: '4 timmar' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '8 timmar' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '12 timmar' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '24 timmar' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2 dagar' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '1 vecka' })).toBeInTheDocument();
  });

  it('should show error when submitting without date', async () => {
    const user = userEvent.setup();
    render(<AddSlotForm />);

    await user.click(screen.getByRole('button', { name: /lägg till tid/i }));

    await waitFor(() => {
      expect(screen.getByText('Välj ett datum')).toBeInTheDocument();
    });
  });

  it('should allow entering a date', async () => {
    const user = userEvent.setup();
    render(<AddSlotForm />);

    const dateInput = screen.getByLabelText(/datum/i);
    await user.type(dateInput, '2025-01-20');

    expect(dateInput).toHaveValue('2025-01-20');
  });

  it('should allow entering a time', async () => {
    const user = userEvent.setup();
    render(<AddSlotForm />);

    const timeInput = screen.getByLabelText(/starttid/i);
    await user.clear(timeInput);
    await user.type(timeInput, '10:30');

    expect(timeInput).toHaveValue('10:30');
  });

  it('should allow selecting a duration', async () => {
    const user = userEvent.setup();
    render(<AddSlotForm />);

    const select = screen.getByLabelText(/längd/i);
    await user.selectOptions(select, '4 timmar');

    expect(select).toHaveValue('4 timmar');
  });

  it('should allow entering notes', async () => {
    const user = userEvent.setup();
    render(<AddSlotForm />);

    const notesInput = screen.getByLabelText(/anteckningar/i);
    await user.type(notesInput, 'Test notes');

    expect(notesInput).toHaveValue('Test notes');
  });

  it('should have minimum date set to today', () => {
    render(<AddSlotForm />);
    const dateInput = screen.getByLabelText(/datum/i);

    const today = new Date().toISOString().split('T')[0];
    expect(dateInput).toHaveAttribute('min', today);
  });
});
