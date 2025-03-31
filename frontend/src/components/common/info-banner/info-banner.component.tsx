import React, { useState } from 'react';
import { Icon, Link } from '@sk-web-gui/react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const InfoBanner: React.FC = () => {
  const [showText, setShowText] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleClick = () => {
    showText ? setShowText(false) : setShowText(true);
  };

  return (
    <div className="w-full bg-vattjom-background-200 py-20">
      <div className="container w-2/3">
        <div className="flex pb-8">
          <div className="p-3 pb-0">
            <Icon icon={<Info />} className="mr-4" color="vattjom" />
          </div>
          <p className="underline">{t('common:info_banner.title')}</p>
        </div>
        {showText ?
          <div>
            <p>{t('common:info_banner.text')}</p>
            <Link onClick={handleClick} className="hover:cursor-pointer">
              {t('common:info_banner.hide_text')}
            </Link>
          </div>
        : <Link className="hover:cursor-pointer" onClick={handleClick}>
            {t('common:info_banner.show_text')}
          </Link>
        }
      </div>
    </div>
  );
};
