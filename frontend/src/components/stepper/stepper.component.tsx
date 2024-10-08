import { Badge, Label } from '@sk-web-gui/react';

function setColor(status) {
  if (status === 'none') return 'tertiary';
  if (status === 'done') return 'gronsta';
  if (status === 'started') return 'vattjom';
}

export const Stepper = (props: any) => {
  const { data, currentPhase, setCurrentPhase } = props;

  const handleClick = (index: number) => {
    setCurrentPhase(index);
  };

  return (
    <div>
      {data.map((day, index) => {
        return (
          <div key={index}>
            <div>
              <p className="my-10">
                <Badge
                  rounded
                  className={
                    day.title === data[currentPhase].title ?
                      'align-top mr-20 bg:primary-surface'
                    : 'align-top mr-20 tertiary'
                  }
                  inverted={day.title !== data[currentPhase].title}
                />
                {day.title === data[currentPhase].title ?
                  <span className="underline font-bold cursor-pointer" onClick={() => handleClick(index)}>
                    {day.title}
                  </span>
                : <span className="underline cursor-pointer" onClick={() => handleClick(index)}>
                    {day.title}
                  </span>
                }{' '}
              </p>
            </div>

            <div className={index < data.length - 1 ? 'border-l-2 m-10 pl-12 pb-8' : 'm-10 pl-12 pb-8'}>
              {day.status !== 'none' ?
                <Label color={setColor(day.status)} className="align-text-bottom mr-4 ml-24" rounded inverted>
                  3 av {day.tasks.length}
                </Label>
              : <Label className="align-text-bottom mr-4 ml-24 text-black" rounded inverted>
                  0 av {day.tasks.length}
                </Label>
              }
              <span className="text-small">Klart senast den {day.endDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
