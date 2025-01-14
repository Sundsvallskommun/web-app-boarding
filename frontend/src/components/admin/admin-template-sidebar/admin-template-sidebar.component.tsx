import { Accordion } from '@sk-web-gui/react';
import { getOrgTemplate, getOrgTree } from '@services/organization-service';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Template } from '@data-contracts/backend/data-contracts';
import sanitized from '@services/sanitizer-service';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import Divider from '@sk-web-gui/divider';

interface SidebarOrgTemplate {
  orgName: string;
  template: Template;
}

export default function AdminTemplateSidebar() {
  const router = useRouter();
  const { orgid } = router.query;

  const getInitialOrgTreeLevel = async () => {
    return await getOrgTree(Number(orgid)).then((res) => res && setCurrentOrgTreeLevel(res.treeLevel));
  };

  const [templateSidebarData, setTemplateSidebarData] = useState<SidebarOrgTemplate[]>([]);
  const [currentOrgTreeId, setCurrentOrgTreeId] = useState<number>(Number(orgid));
  const [currentOrgTreeLevel, setCurrentOrgTreeLevel] = useState<number>(0);

  useEffect(() => {
    if (currentOrgTreeLevel === 0) {
      getInitialOrgTreeLevel().then((res) => {
        res && setCurrentOrgTreeLevel(res);
      });
    }

    getUpperLevelTemplates();
  }, [orgid, currentOrgTreeLevel]);

  const getUpperLevelTemplates = useCallback(async () => {
    if (currentOrgTreeId && currentOrgTreeLevel) {
      for (let i = 0; i < currentOrgTreeLevel - 1; i++) {
        getOrgTree(currentOrgTreeId).then(async (res) => {
          if (res) {
            await getOrgTemplate(res.parentId).then((upperLevelOrg) => {
              upperLevelOrg &&
                upperLevelOrg.checklists.map((template) => {
                  if (template.lifeCycle === 'ACTIVE') {
                    setTemplateSidebarData([
                      ...templateSidebarData,
                      {
                        orgName: upperLevelOrg?.organizationName,
                        template: template,
                      },
                    ]);
                  }
                });

              setCurrentOrgTreeId(res.parentId);
            });
          }
        });
      }
    }
  }, []);

  return currentOrgTreeLevel && templateSidebarData.length ?
      <div className="w-full max-w-[33rem] right-0 ml-40 border-l-1 border-divider gap-16 py-32 px-20 break-words">
        <h4 className="text-h4-sm">Aktiviteter från andra nivåer</h4>

        {templateSidebarData.toReversed().map((template) => {
          return (
            <Accordion size="sm">
              <Accordion.Item header={<h4 className="text-h4-sm">{template.orgName}</h4>}>
                {template.template.phases.map((phase) => {
                  return (
                    <div className="gap-16 my-16">
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
              </Accordion.Item>
            </Accordion>
          );
        })}
      </div>
    : null;
}
