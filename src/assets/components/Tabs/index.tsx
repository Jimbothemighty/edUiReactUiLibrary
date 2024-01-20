import { useState, ReactNode, ReactElement } from 'react'
import styles from './Tabs.module.css'
import * as React from 'react'

interface TabProps {
  label: string;
  children: ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>

interface TabsProps {
  children: ReactElement<TabProps>[];
  defaultActiveTabByLabel?: string;
}

const Tabs: React.FC<TabsProps> = ({ children, defaultActiveTabByLabel }) => {
	const [activeIndex, setActiveIndex] = useState<string>(defaultActiveTabByLabel || children[0].props.label)

	const handleTabClick = (index: string) => {
		setActiveIndex(index)
	}

	return (
		<div className={styles.tabsContainer}>
			<div className={styles.tabs}>
				{children.map((tab, index) => (
					<div
						key={tab.props.label}
						className={`${styles.tab} ${tab.props.label === activeIndex ? styles.active : ``}`}
						onClick={() => handleTabClick(tab.props.label)}
					>
						{tab.props.label}
					</div>
				))}
			</div>
			{children.map((child, index) => {
				return <div key={index} className={styles.tabContent} style={{ display: child.props.label === activeIndex ? `flex` : `none` }}>{child}</div> // children[activeIndex]
			})}
		</div>
	)
}

export { Tabs, Tab }
