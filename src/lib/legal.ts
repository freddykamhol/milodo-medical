type OptionalString = string | undefined | null;

function clean(value: OptionalString): string | null {
  const v = String(value ?? "")
    .trim()
    // Some hosts (e.g. Plesk) store multiline env values as escaped sequences.
    // Convert literal "\n" into real newlines so `whitespace-pre-line` renders properly.
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "");
  return v ? v : null;
}

export type LegalEntity = {
  companyName: string | null;
  legalForm: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  representative: string | null;
};

export function legalEntityFromEnv(): LegalEntity {
  return {
    companyName: clean(process.env.NEXT_PUBLIC_COMPANY_NAME),
    legalForm: clean(process.env.NEXT_PUBLIC_COMPANY_LEGAL_FORM),
    address: clean(process.env.NEXT_PUBLIC_COMPANY_ADDRESS),
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_COMPANY_PHONE),
    representative: clean(process.env.NEXT_PUBLIC_COMPANY_REPRESENTATIVE),
  };
}
