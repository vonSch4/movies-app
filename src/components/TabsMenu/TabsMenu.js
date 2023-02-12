import { Tabs } from 'antd';
import { Online } from 'react-detect-offline';

import './TabsMenu.css';

export default function TabsMenu(props) {
  const {
    children: Header,
    changeTab,
    loadingError,
    loadingSpinner,
    cardListSearch,
    cardListRated,
  } = props;

  const tabsItems = [
    {
      key: 'search',
      label: 'Search',
      children: (
        <>
          {Header}
          <Online>
            <main className="main">
              {loadingError}
              {loadingSpinner}
              {cardListSearch}
            </main>
          </Online>
        </>
      ),
    },
    {
      key: 'rated',
      label: 'Rated',
      children: (
        <Online>
          <main className="main">
            {loadingError}
            {loadingSpinner}
            {cardListRated}
          </main>
        </Online>
      ),
    },
  ];

  return (
    <Tabs
      items={tabsItems}
      size="large"
      onChange={changeTab}
      destroyInactiveTabPane
    />
  );
}
