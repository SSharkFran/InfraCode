import { useEffect, useState } from "react";

export type PublicContactConfig = {
  contactEmail: string;
  whatsappUrl: string;
  whatsappDisplay: string;
  instagramUrl: string;
  jurisPocketUrl: string;
};

const DEFAULT_PUBLIC_CONTACT_CONFIG: PublicContactConfig = {
  contactEmail: "contato@infracode.tech",
  whatsappUrl:
    "https://wa.me/5568999999999?text=Ola!%20Vim%20pelo%20site%20da%20InfraCode%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.",
  whatsappDisplay: "+55 (68) 99999-9999",
  instagramUrl: "https://www.instagram.com/infracode_br?igsh=aDVoeHFkZWR1ZWd2",
  jurisPocketUrl: "",
};

export const usePublicContactConfig = () => {
  const [publicConfig, setPublicConfig] = useState<PublicContactConfig>(
    DEFAULT_PUBLIC_CONTACT_CONFIG,
  );

  useEffect(() => {
    let active = true;

    const loadPublicConfig = async () => {
      try {
        const response = await fetch("/api/site-config");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          data?: Partial<PublicContactConfig>;
        };

        if (!active || !payload.data) {
          return;
        }

        setPublicConfig((previous) => ({
          contactEmail:
            payload.data?.contactEmail?.trim() || previous.contactEmail,
          whatsappUrl: payload.data?.whatsappUrl?.trim() || previous.whatsappUrl,
          whatsappDisplay:
            payload.data?.whatsappDisplay?.trim() || previous.whatsappDisplay,
          instagramUrl:
            payload.data?.instagramUrl?.trim() || previous.instagramUrl,
          jurisPocketUrl:
            payload.data?.jurisPocketUrl?.trim() || previous.jurisPocketUrl,
        }));
      } catch {
        // Keep defaults when API is unavailable.
      }
    };

    void loadPublicConfig();

    return () => {
      active = false;
    };
  }, []);

  return publicConfig;
};
