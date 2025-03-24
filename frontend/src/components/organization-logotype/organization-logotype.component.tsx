import React, { useEffect, useState } from 'react';
import { useUserStore } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';
import { logotypeUrls } from '@utils/logotypeUrls';
import Image from 'next/image';

export const OrganizationLogotype: React.FC = () => {
  const user = useUserStore(useShallow((state) => state.user));
  const [logotype, setLogotype] = useState<{ url: string; altText: string } | null>(null);

  useEffect(() => {
    switch (user.organizationId) {
      case 2725:
        setLogotype(logotypeUrls.mitthem);
        break;

      case 2764:
        setLogotype(logotypeUrls.mittsverigeVattenOchAvfall);
        break;

      case 2669:
        setLogotype(logotypeUrls.servanet);
        break;

      case 2754:
        setLogotype(logotypeUrls.skifu);
        break;

      case 2744:
        setLogotype(logotypeUrls.sundsvallEnergi);
        break;

      case 2668:
        setLogotype(logotypeUrls.sundsvallElnat);
        break;

      case 2755:
        setLogotype(logotypeUrls.sundsvallsHamn);
        break;

      default:
        setLogotype(null);
        break;
    }
  }, [user.organizationId]);

  return (
    <div className="w-full">
      {logotype && <Image width={125} height={35} src={logotype.url} alt={logotype.altText} />}
    </div>
  );
};
