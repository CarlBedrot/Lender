import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useCreateSlot } from '../../hooks/useSlots';
import type { SlotDuration } from '../../lib/types';

const DURATION_OPTIONS: { value: SlotDuration; label: string }[] = [
  { value: '4 timmar', label: '4 timmar' },
  { value: '8 timmar', label: '8 timmar' },
  { value: '12 timmar', label: '12 timmar' },
  { value: '24 timmar', label: '24 timmar' },
  { value: '2 dagar', label: '2 dagar' },
  { value: '1 vecka', label: '1 vecka' },
];

export function AddSlotForm() {
  const createSlot = useCreateSlot();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [duration, setDuration] = useState<SlotDuration>('8 timmar');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!date) {
      setError('Välj ett datum');
      return;
    }

    try {
      await createSlot.mutateAsync({
        date,
        start_time: startTime,
        duration,
        notes: notes || undefined,
      });
      setSuccess(true);
      setDate('');
      setNotes('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('unique')) {
          setError('Det finns redan en tid för detta datum');
        } else {
          setError(err.message);
        }
      } else {
        setError('Något gick fel');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="date"
          label="Datum"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
        />

        <Input
          type="time"
          label="Starttid"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <Select
          label="Längd"
          value={duration}
          onChange={(e) => setDuration(e.target.value as SlotDuration)}
          options={DURATION_OPTIONS}
        />

        <Input
          type="text"
          label="Anteckningar (valfritt)"
          placeholder="T.ex. 'Hämta vid Triangeln'"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-lender-accent text-sm">Tid tillagd!</p>
        )}

        <Button type="submit" disabled={createSlot.isPending} className="w-full">
          {createSlot.isPending ? 'Lägger till...' : 'Lägg till tid'}
        </Button>
      </form>
    </Card>
  );
}
