/* ==================================================================================
   AUTH FORM - Universal Login/Signup/Reset Form
   ==================================================================================
   ✅ 3 Modes: login, signup, reset
   ✅ Portal-aware theming
   ✅ Conditional fields based on mode
   ================================================================================== */

import { UseFormReturn } from 'react-hook-form';
import { UnifiedForm, FormField } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

interface AuthFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode: 'login' | 'signup' | 'reset';
  portal?: 'entrepreneur' | 'customer' | 'driver';
  loading?: boolean;
  showCompanyName?: boolean; // Only for entrepreneur signup
}

export function AuthForm({
  form,
  onSubmit,
  mode,
  portal = 'entrepreneur',
  loading,
  showCompanyName = false,
}: AuthFormProps) {
  const { auth } = FORM_FIELDS_REGISTRY;

  // Build fields based on mode
  const getFields = (): FormField[] => {
    if (mode === 'login') {
      return [auth.loginEmail, auth.loginPassword];
    }
    
    if (mode === 'signup') {
      const fields = [];
      if (showCompanyName) {
        fields.push(auth.signupCompanyName);
      }
      fields.push(
        auth.signupFirstName,
        auth.signupLastName,
        auth.signupEmail,
        auth.signupPhone,
        auth.signupPassword,
        auth.signupPasswordConfirm,
        auth.signupAgbAccepted
      );
      return fields as FormField[];
    }
    
    // Reset mode
    return [auth.resetEmail];
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'login': return 'Anmelden';
      case 'signup': return 'Registrieren';
      case 'reset': return 'Passwort zurücksetzen';
    }
  };

  const getSubmitLabel = () => {
    switch (mode) {
      case 'login': return 'Anmelden';
      case 'signup': return 'Registrieren';
      case 'reset': return 'Link senden';
    }
  };

  return (
    <UnifiedForm
      form={form}
      fields={getFields()}
      onSubmit={onSubmit}
      mode="inline"
      portal={portal}
      loading={loading}
      submitLabel={getSubmitLabel()}
      resetOnSuccess={mode !== 'login'}
    />
  );
}
