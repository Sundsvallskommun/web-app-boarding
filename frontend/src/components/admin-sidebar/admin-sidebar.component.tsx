import { Avatar, Icon, Label, Logo, MenuVertical, SearchField } from '@sk-web-gui/react';
import { MenuIndex } from '@sk-web-gui/menu-vertical/dist/types/menu-vertical-context';
import React, { useState } from 'react';
import { OrganizationMenu } from '@components/organization-menu/organization-menu.component';

const AdminSearchField = (args) => {
  const [term, setTerm] = useState('');
  const [dirty, setDirty] = useState(false);
  const onChangeHandler = (event: React.BaseSyntheticEvent) => {
    setTerm(event.target.value);
    setDirty(true);
  };
  const onCloseHandler = () => {
    console.log('onCloseHandler');
    setDirty(false);
  };
  const onSearchHandler = (query: string) => {
    console.log('onSearchHandler', query);
    setDirty(false);
  };
  return (
    <SearchField
      {...args}
      placeholder="Sök i organisationsträdet"
      size="md"
      value={term}
      showSeachButton={dirty}
      onChange={onChangeHandler}
      onClose={onCloseHandler}
      onSearch={onSearchHandler}
    />
  );
};

export default function AdminSidebar(args) {
  const [current, setCurrent] = React.useState<MenuIndex>(1001);
  const handleSetCurrent = (menuIndex: React.SetStateAction<MenuIndex>) => {
    console.log('handleSetCurrent menuIndex', menuIndex);
    setCurrent(menuIndex);
  };

  return (
    <div className="w-[45rem] bg-background-content">
      <MenuVertical.Provider current={current} setCurrent={handleSetCurrent}>
        {({ setCurrentActiveFocus }) => (
          <MenuVertical.Nav className="min-h-full p-20 shadow-xl">
            <Logo variant="service" title="Digital checklista" subtitle="Administratör" className="mt-24" />

            <Avatar className="my-40" />

            <MenuVertical.Label className="mb-16">Introduktioner</MenuVertical.Label>
            <Label className="w-full py-24 justify-start mb-24">Pågående introduktioner</Label>

            <MenuVertical.Label>Organisationsträd</MenuVertical.Label>
            <AdminSearchField />

            <OrganizationMenu />
          </MenuVertical.Nav>
        )}
      </MenuVertical.Provider>
    </div>
  );
}
