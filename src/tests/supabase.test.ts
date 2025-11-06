import { supabase } from '../integrations/supabase/client';

describe('Supabase Integration', () => {
  it('should fetch bookings', async () => {
    const { data } = await supabase.from('bookings').select('*');
    expect(data).toBeDefined();
  });
});
