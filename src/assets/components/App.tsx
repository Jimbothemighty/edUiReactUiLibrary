import { NavBar } from "./NavBar"
import "~/assets/css/style.css"
import { Tab, Tabs } from "~/assets/components/Tabs"
import { useState } from "react"
import { PopupDialog } from "~/assets/components/PopupDialog"
import { Table, TableColumn } from "~/assets/components/Table"
import * as React from "react"
import ContextMenu from "~/assets/components/ContextMenu"
import { Toggle } from "~/assets/components/Controls/Toggle"
import Dropdown from "~/assets/components/Controls/Dropdown"
import Input from "~/assets/components/Controls/Input"
import Button from "~/assets/components/Controls/Button"
import FilePicker from "~/assets/components/Controls/FilePicker"
import { LightDarkToggle } from "~/assets/components/LightDarkToggle"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "~/redux/store"
import { rootThemeClass, rootThemeColour } from "~/assets/js/setUserPreferences"
import { setThemeColour, themeColor } from '~/redux/userPreferences'
import Calendar, { eventType } from "~/assets/components/Controls/Calendar"
import { addDays } from "date-fns"
import Kanban from "~/assets/components/Kanban"

export function App() {
	const theme = useSelector((state: RootState) => state.userPreferences.theme)
	const themeColour = useSelector((state: RootState) => state.userPreferences.themeColour)

	React.useEffect(() => {
		rootThemeClass(theme)
	}, [theme])

	React.useEffect(() => {
		rootThemeColour(themeColour)
	}, [themeColour])

	return <div className="App">
		<NavBar />
		<div style={{ padding: `10px`, flexGrow: `1` }}>
			<Tabs defaultActiveTabByLabel="Kanban">
				<Tab label="Theme">
					<h3>Set Light / Dark Theme</h3>
					<LightDarkToggle/>
					<h3>Set Theme Colour</h3>
					<ThemeColours/>
				</Tab>
				<Tab label="Controls">
					<ControlsTest/>
				</Tab>
				<Tab label="Popup">
					<PopupTest/>
				</Tab>
				<Tab label="Context Menu">
					<ContextMenuTest/>
				</Tab>
				<Tab label="Table">
					<TableTest/>
				</Tab>
				<Tab label="Tabs">
					<TabsTest/>
				</Tab>
				<Tab label="Calendar">
					<CalendarTest/>
				</Tab>
				<Tab label="Kanban">
					<KanbanTest/>
				</Tab>
			</Tabs>
		</div>
	</div>
}

function KanbanTest() {
	const initialColumns = [
		{ id: `todo`, title: `To Do` },
		{ id: `in-progress`, title: `In Progress` },
		{ id: `in-review`, title: `In Review` },
		{ id: `done`, title: `Done` },
	]

	const initialCards = [
		{ id: 1, content: `Task 1`, status: `todo` },
		{ id: 2, content: `Task 2`, status: `todo` },
		{ id: 3, content: `Task 3`, status: `in-progress` },
		{ id: 4, content: `Task 4`, status: `in-progress` },
		{ id: 5, content: `Task 5`, status: `in-progress` },
		{ id: 6, content: `Task 6`, status: `in-progress` },
		{ id: 7, content: `Task 7`, status: `in-review` },
		{ id: 8, content: `Task 8`, status: `in-review` },
		{ id: 9, content: `Task 9`, status: `done` },
	]

	return <Kanban initialCards={initialCards} initialColumns={initialColumns} />
}

function ThemeColours() {
	const dispatch: AppDispatch = useDispatch()
	const themeColours : themeColor[] = [{
		txt: `white`,
		bg: `#c0392b`,
	},
	{
		txt: `white`,
		bg: `#2980B9`,
	},
	{
		txt: `white`,
		bg: `#16a085`,
	},
	{
		txt: `#222222`,
		bg: `#f1c40f`,
	}]

	return <div>
		{themeColours.map((themeColour, index) => {
			return <div key={index} onClick={() => {
				dispatch(setThemeColour(themeColour))
			}}>
				<div style={{
					backgroundColor: themeColour.bg,
					width: `300px`,
					height: `50px`,
					cursor: `pointer`,
				}}><span style={{
						lineHeight: `2`,
						padding: `5px`,
						color: themeColour.txt,
					}}>{themeColour.bg}</span></div>
			</div>
		})}
	</div>
}

function TabsTest() {
	return <>
		<h1>React Tabs Example</h1>
		<Tabs>
			<Tab label="Tab 1">
				<p>Content for Tab 1</p>
			</Tab>
			<Tab label="Tab 2">
				<p>Content for Tab 2</p>
			</Tab>
			<Tab label="Tab 3">
				<p>Content for Tab 3</p>
			</Tab>
		</Tabs>
	</>
}

function PopupTest() {
	const [isPopupOpen, setIsPopupOpen] = useState(false)

	const handlePopupClose = (answer: boolean) => {
		alert(`User chose: ${answer ? `Yes` : `No`}`)
		setIsPopupOpen(false)
	}

	const handleOpenPopup = () => {
		setIsPopupOpen(true)
	}

	return (
		<div>
			<h1>React Popup Dialog Example</h1>
			<Button onClick={handleOpenPopup} label={`Open Popup`}/>
			<PopupDialog isOpen={isPopupOpen} onClose={handlePopupClose} />
		</div>
	)
}

function TableTest() {
	const headers : TableColumn[] = [
		{ key: `ID`, label: `ID`, dataType: `number` },
		{ key: `Name`, label: `Name`, dataType: `string` },
		{ key: `Age`, label: `Age`, dataType: `number`, hidden: true },
	]

	const data = [
		{ ID: 1, Name: `John Doe`, Age: 25 },
		{ ID: 2, Name: `Jane Smith`, Age: 30 },
		{ ID: 3, Name: `Bob Johnson`, Age: 22 },
	]

	return (
		<div className="app-container">
			<h1>React Table Component Example</h1>
			<Table headers={headers} data={data} />
		</div>
	)
}

function ContextMenuTest() {
	const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault()
		setContextMenuPosition({ x: event.clientX, y: event.clientY })
		setIsContextMenuOpen(true)
	}

	const closeContextMenu = () => {
		setIsContextMenuOpen(false)
	}

	return (
		<>
			<h1>React Context menu test</h1>
			<div onContextMenu={handleContextMenu}>
				<h2>Right-click me!</h2>
				<ContextMenu isOpen={isContextMenuOpen} xPos={contextMenuPosition.x} yPos={contextMenuPosition.y} onClose={closeContextMenu}>
					<li>Action 1</li>
					<li>Action 2</li>
					<li>Action 3</li>
				</ContextMenu>
			</div>
		</>
	)
}

function ControlsTest() {
	const options = [
		{ value: `1`, label: `Option 1` },
		{ value: `2`, label: `Option 2` },
		{ value: `3`, label: `Option 3` },
		{ value: `4`, label: `Option 4` },
	]
	return <>
		<h1>React Controls Example</h1>
		<h3>Input</h3>
		<Input label="Text input" type="text" onChange={() => {}}/>
		<br/>
		<Input label="Number input" type="number" onChange={() => {}}/>
		<br/>
		<Input label="Date input" type="date" onChange={() => {}}/>
		<br/>
		<Input label="Checkbox input" type="checkbox" onChange={() => {}}/>
		<h3>FilePicker</h3>
		<FilePicker onFileSelected={() => {}}/>
		<h3>Dropdown (virtual)</h3>
		<Dropdown options={options} onSetValue={() => {}} />
		<h3>Toggle</h3>
		<Toggle onToggle={() => {}}/>
		<h3>Button</h3>
		<Button label="Button (Click me)" onClick={() => { alert(`Clicked`) }}/>
		<br/>
		<br/>
		<Button label="Button (disabled)" onClick={() => {}} disabled={true}/>
		<br/>
		<br/>
	</>
}

function CalendarTest() {
	React.useEffect(() => {
		console.log(`mount`)

		return console.log(`unmount`)
	}, [])

	const events : eventType[] = [
		{
			id: 1,
			from: new Date(),
			to: new Date(),
			label: `Event 1`,
		},
		{
			id: 2,
			from: new Date(),
			to: new Date(),
			label: `Event 2`,
		},
		{
			id: 3,
			from: addDays(new Date(), 5),
			to: addDays(new Date(), 5),
			label: `Event 3`,
		},
		{
			id: 4,
			from: addDays(new Date(), -5),
			to: addDays(new Date(), -5),
			label: `Event 4`,
		},
	]

	return 		<>
		<h1>React Calendar test</h1>
		<Calendar eventsArr={events}/>
	</>
}
