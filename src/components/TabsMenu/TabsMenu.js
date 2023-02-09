import { Tabs } from 'antd';

import './TabsMenu.css';

export default function TabsMenu(props) {
  const { children, getGuestRating } = props;

  return (
    <Tabs
      items={[
        { key: 'search', label: 'Search', children },
        { key: 'rated', label: 'Rated', children: children[1] },
      ]}
      size="large"
      onChange={(key) => {
        if (key === 'rated') getGuestRating();
      }}
      destroyInactiveTabPane
    />
  );
}
