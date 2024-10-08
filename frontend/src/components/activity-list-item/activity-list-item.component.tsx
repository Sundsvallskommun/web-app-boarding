import { Checkbox, Divider, Icon, Label, Link, TextField } from '@sk-web-gui/react';

export const ActivityListItem = (props: any) => {
  const { task } = props;

  return (
    <div>
      <Divider />
      <div className="my-4 flex p-16">
        <div className="w-10/12 mt-8 flex items-start">
          {task.type === 'checkbox' ?
            <Checkbox checked={task.done} className="pr-3" />
          : null}
          <div className={task.type === 'checkbox' ? 'pl-20' : ''}>
            <div className={task.done && 'text-dark-disabled'}>
              {task.linkUrl ?
                <>
                  <span className="font-bold underline cursor-pointer">{task.linkTitle}</span>{' '}
                  <Link href="#">
                    <Icon name="external-link" size="1em" className="align-text-top" />
                  </Link>
                </>
              : <span className="mr-3 font-bold">{task.linkTitle}</span>}
              <p>{task.description}</p>
              {task.type === 'textfield' && <TextField size="sm" className="w-full" />}
            </div>
          </div>
        </div>
        <div className="w-2/12 text-right mt-8 mr-8">
          {' '}
          {task.labelText && (
            <Label color="bjornstigen" rounded inverted>
              {task.labelText}
            </Label>
          )}
        </div>
      </div>
    </div>
  );
};
