import { Checklist } from '@data-contracts/backend/data-contracts';
import { getOrgTemplates, getParentChain, useOrgTree } from '@services/organization-service';
import sanitized from '@services/sanitizer-service';
import Divider from '@sk-web-gui/divider';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Accordion, Button } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleType } from '@data-contracts/RoleType';

interface AdminTemplateSidebarProps {
  currentView: number;
}

interface SidebarOrgTemplate {
  orgName: string;
  orgId: number;
  template: Checklist | undefined;
}

export const AdminTemplateSidebar: React.FC<AdminTemplateSidebarProps> = (props) => {
  const { currentView } = props;
  const router = useRouter();
  const { orgid } = router.query;
  const { data: orgTree } = useOrgTree();
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true);
  const [templateSidebarData, setTemplateSidebarData] = useState<SidebarOrgTemplate[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const chain = getParentChain(orgTree, Number(orgid));
    getOrgTemplates(
      Number(orgid),
      chain.map((org) => org.orgId)
    ).then((res) => {
      if (res) {
        const templateData = res
          .filter((org) => org.organizationNumber !== Number(orgid))
          .map((org) => {
            const activeTemplate = org.checklists.find((checklist) => checklist.lifeCycle === 'ACTIVE');
            return {
              orgName: org.organizationName,
              orgId: org.organizationNumber,
              template: activeTemplate,
            };
          });
        setTemplateSidebarData(templateData);
        setLoadingTemplates(false);
      }
    });
  }, [orgid]);

  return (
    <div className="w-full max-w-[43rem] right-0 ml-40 border-l-1 border-divider gap-16 py-32 pl-20 pr-0 break-words">
      <h4 className="text-h4-sm mb-16">{t('templates:other_level_activities')}</h4>

      {templateSidebarData.filter((org) => !!org?.template).length > 0 ?
        templateSidebarData
          .filter((org) => !!org?.template)
          .map((org, index) => {
            return (
              <Accordion key={`template-accordion-${index}`} data-cy={`template-accordion-${index}`} size="sm">
                <Accordion.Item
                  key={`template-accordion-items-${index}`}
                  data-cy={`template-accordion-item-${index}`}
                  header={<h4 className="text-h4-sm">{org.orgName}</h4>}
                >
                  {org?.template?.phases.map((phase, index) => {
                    return (
                      <div className="gap-16 my-16" key={`${org.orgId}-${phase.id}-${index}`}>
                        <p className="text-label-medium mt-16">{phase.name}</p>
                        {phase.tasks
                          ?.filter((t) =>
                            currentView === 0 ?
                              t.roleType === RoleType.MANAGER_FOR_NEW_EMPLOYEE ||
                              t.roleType === RoleType.MANAGER_FOR_NEW_MANAGER
                            : t.roleType === RoleType.NEW_EMPLOYEE || t.roleType === RoleType.NEW_MANAGER
                          )
                          .map((task, idx) => (
                            <div key={`task-${index}-${idx}`}>
                              <div className="my-16 ml-8">
                                {task.headingReference ?
                                  <>
                                    <a className="underline mr-4" href={task.headingReference} target="_blank">
                                      {task.heading}
                                    </a>
                                    <Icon size="1.5rem" name="external-link" />
                                  </>
                                : task.heading}

                                <p
                                  className="text-small my-0 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg [&>*>a]:underline"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitized(task.text || '').replace('<a', "<a target='_blank'"),
                                  }}
                                ></p>
                              </div>
                              <Divider className="my-16" />
                            </div>
                          ))}
                      </div>
                    );
                  })}
                  <div>
                    <Button
                      data-cy={`template-link-${index}`}
                      size="sm"
                      variant="secondary"
                      className="mt-16"
                      rightIcon={<Icon name="arrow-right" />}
                      onClick={() => {
                        router.push(`/admin/templates/${org.orgId}/${org.template?.id}`);
                      }}
                    >
                      {t('templates:go_to_template')}
                    </Button>
                  </div>
                </Accordion.Item>
              </Accordion>
            );
          })
      : loadingTemplates ?
        <h5 className="text-base">{t('templates:fetching_other_levels')}</h5>
      : <h5 className="text-base">{t('templates:no_templates_available')}</h5>}
    </div>
  );
};
