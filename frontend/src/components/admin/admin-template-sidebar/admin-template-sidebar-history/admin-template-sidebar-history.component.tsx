import React, { useEffect, useState } from 'react';
import { Events } from '@data-contracts/backend/data-contracts';
import { getTemplateHistory } from '@services/template-service/template-service';
import { useRouter } from 'next/router';
import { Spinner } from '@sk-web-gui/react';
import dayjs from 'dayjs';

export const AdminTemplateSidebarHistory: React.FC = () => {
  const router = useRouter();
  const { templateid } = router.query;
  const [templateHistory, setTemplateHistory] = useState<Events>();

  useEffect(() => {
    if (templateid) {
      getTemplateHistory(templateid.toString()).then((res) => {
        setTemplateHistory(res);
      });
    }
  }, [templateid]);

  return templateHistory ?
      <div>
        {templateHistory &&
          templateHistory?.eventList?.map((event, index) => {
            return (
              <div
                data-cy={`history-event-${index}`}
                key={`history-event-${index}`}
                className={
                  'first:mt-lg relative pb-md px-md flex flex-col gap-sm' +
                  (index < templateHistory.eventList.length - 1 && 'border-0 border-l-1 border-gray-300')
                }
              >
                <div className="bg-white absolute m-0 p-0 flex items-start justify-start -left-[4px] top-0 w-[7px] h-[7px] border-2 border-gray-700 rounded-full"></div>
                <p className="font-normal -mt-[4px] mb-6">
                  {event.message} av {event.metadata[0].value}
                </p>
                <small className="mb-6">{dayjs(event.created).format('DD MMMM YYYY, HH.mm')}</small>
              </div>
            );
          })}
      </div>
    : <div className="w-full justify-items-center">
        <Spinner />
      </div>;
};
