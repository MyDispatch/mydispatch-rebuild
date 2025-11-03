import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { PartnerForm as PartnerFormWrapper } from '@/components/forms/wrapped/PartnerForm';
import { useForm } from 'react-hook-form';

interface PartnerFormProps {
  partner?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PartnerForm({ partner, onSuccess, onCancel }: PartnerFormProps) {
  const { profile } = useAuth();

  const form = useForm({
    defaultValues: {
      name: partner?.name || '',
      email: partner?.email || '',
      phone: partner?.phone || '',
      provision_per_booking: partner?.provision_amount || 0,
      provision_percentage: partner?.provision_percentage || 0,
      online_access_enabled: partner?.online_access_enabled || false,
      notes: partner?.notes || '',
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const partnerData = {
        name: values.name,
        email: values.email || null,
        phone: values.phone || null,
        provision_amount: values.provision_per_booking || 0,
        provision_percentage: values.provision_percentage || 0,
        online_access_enabled: values.online_access_enabled || false,
        notes: values.notes || null,
        company_id: profile.company_id,
      };

      if (partner) {
        const { error } = await supabase
          .from('partners')
          .update(partnerData)
          .eq('id', partner.id)
          .eq('company_id', profile.company_id);

        if (error) throw error;

        handleSuccess('Partner erfolgreich aktualisiert');
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([partnerData]);

        if (error) throw error;

        handleSuccess('Partner erfolgreich erstellt');
      }

      onSuccess();
    } catch (error: any) {
      handleError(error, 'Partner konnte nicht gespeichert werden');
    }
  };

  return (
    <PartnerFormWrapper
      form={form}
      onSubmit={onSubmit}
      mode="dialog"
      loading={form.formState.isSubmitting}
    />
  );
}
