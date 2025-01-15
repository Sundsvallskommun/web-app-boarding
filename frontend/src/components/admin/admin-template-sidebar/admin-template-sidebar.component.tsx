import { Checklist } from '@data-contracts/backend/data-contracts';
import { getOrgTemplates, getParentChain, useOrgTree } from '@services/organization-service';
import sanitized from '@services/sanitizer-service';
import Divider from '@sk-web-gui/divider';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Accordion, Button, Link } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface SidebarOrgTemplate {
  orgName: string;
  orgId: number;
  template: Checklist | undefined;
}

export default function AdminTemplateSidebar() {
  const router = useRouter();
  const { orgid } = router.query;
  const { data: orgTree } = useOrgTree();
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true);
  const [templateSidebarData, setTemplateSidebarData] = useState<SidebarOrgTemplate[]>([]);

  useEffect(() => {
    const chain = getParentChain(orgTree, Number(orgid));
    getOrgTemplates(chain.map((org) => org.orgId)).then((res) => {
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
      <h4 className="text-h4-sm mb-16">Aktiviteter från andra nivåer</h4>

      {templateSidebarData.filter((org) => !!org?.template).length > 0 ?
        templateSidebarData
          .filter((org) => !!org?.template)
          .map((org) => {
            return (
              <>
                <Accordion size="sm">
                  <Accordion.Item header={<h4 className="text-h4-sm">{org.orgName}</h4>}>
                    {org?.template?.phases.map((phase, index) => {
                      return (
                        <div className="gap-16 my-16" key={`${phase.id}-${index}`}>
                          <p className="text-label-medium mt-16">{phase.name}</p>
                          {phase.tasks?.map((task) => (
                            <>
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
                            </>
                          ))}
                        </div>
                      );
                    })}
                    <div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-16"
                        rightIcon={<Icon name="arrow-right" />}
                        onClick={() => {
                          router.push(`/admin/templates/${org.orgId}/${org.template?.id}`);
                        }}
                      >
                        Gå till mall
                      </Button>
                    </div>
                  </Accordion.Item>
                </Accordion>
              </>
            );
          })
      : loadingTemplates ?
        <h5 className="text-base">Hämtar andra nivåer..</h5>
      : <h5 className="text-base">Inga mallar tillgängliga</h5>}
    </div>
  );
}
