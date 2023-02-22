import { Tabs } from 'antd';

import './TabsMenu.css';

export default function TabsMenu(props) {
  const {
    children: Header,
    changeTab,
    tabs,
    loadingError,
    networkError,
    loadingSpinner,
    cardListSearch,
    cardListRated,
  } = props;

  const tabsItems = [
    {
      key: tabs.search,
      label: tabs.search,
      children: (
        <>
          {Header}
          <main className="main">
            {networkError || loadingError}
            {loadingSpinner}
            {cardListSearch}
          </main>
        </>
      ),
    },
    {
      key: tabs.rated,
      label: tabs.rated,
      children: (
        <main className="main">
          {networkError || loadingError}
          {loadingSpinner}
          {cardListRated}
        </main>
      ),
    },
  ];

  return (
    <Tabs
      defaultActiveKey={tabs.search}
      items={tabsItems}
      size="large"
      onChange={changeTab}
      centered
    />
  );
}
