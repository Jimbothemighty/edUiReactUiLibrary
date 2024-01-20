import { useState, ReactNode } from 'react'
import styles from './Calendar.module.css'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Button from '~/assets/components/Controls/Button'

function getPeriodStartAndEnd(currentDate, viewMode) {
	const monthStart : Date = startOfMonth(currentDate)
	let startDate: Date
	let endDate: Date

	if (viewMode === `week`) {
		startDate = startOfWeek(currentDate)
		endDate = endOfWeek(currentDate)
	} else {
		// Month view logic
		startDate = startOfWeek(monthStart)
		endDate = endOfWeek(endOfMonth(monthStart))
	}

	return { startDate, endDate }
}

export type eventType = {
	id : number,
	from : Date,
	to : Date,
	label: string
}

type calendarPropsType = {
	eventsArr : eventType[]
}

const Day = ({ day, events, moveEvent }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: `event`,
		drop: (item : eventType) => {
			if (item) {
				moveEvent(item, day)
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}))

	const dateFormat : string = `d`
	let formattedDate : string = format(day, dateFormat)

	return (
		<div ref={drop} className={styles.day}>
			<div className={styles.dayInner}>
				{formattedDate}
				<br/>
				<div className={styles.dayEvents}>
					{
						events.map((event, index) => {
							return <DraggableEvent key={event.id} event={event} moveEvent={moveEvent} />
						})
					}
				</div>
			</div>
		</div>
	)
}

type draggableEventType = {
	event : eventType,
	moveEvent : () => void
}

const DraggableEvent = ({ event, moveEvent } : draggableEventType) => {
	// const [collected, drag, dragPreview] = useDrag(() => ({
	// 	type: `event`,
	// 	item: event,
	// 	collect: (monitor) => ({
	// 		isDragging: monitor.isDragging(),
	// 	}),
	// }))

	const [{ isDragging }, drag] = useDrag(() => ({
		type: `event`,
		item: event,
		// end: (item, monitor) => {
		// 	// debugger
		// 	const dropResult = monitor.getDropResult()
		// 	// if (item && dropResult) {
		// 	moveEvent(item.id, dropResult.day)
		// 	// }
		// },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	return (
		<div ref={drag} className={styles.event} style={{ opacity: isDragging ? 0.5 : 1 }}>
			{event.label}
		</div>
	)
}

const RenderHeader = ({ currentDate, nowPeriod, nextPeriod, prevPeriod, toggleViewMode, viewMode }) => {
	let { startDate, endDate } = getPeriodStartAndEnd(currentDate, viewMode)
	const dateFormat = viewMode === `month` ? `MMMM yyyy` : `MMMM yyyy`
	const dateLabel = () => viewMode === `month` ? format(currentDate, dateFormat) : `${format(startDate, `do`)} to ${format(endDate, `do`)} ${format(currentDate, dateFormat)}`

	return (
		<div className={styles.header}>
			<h2>{dateLabel()}</h2>
			<div className={styles.buttonContainer}>
				<Button onClick={nowPeriod} label={`Now`}/>
				<Button onClick={prevPeriod} label="Prev" />
				<Button onClick={nextPeriod} label="Next" />
				<Button onClick={toggleViewMode} label={viewMode === `month` ? `Week View` : `Month View`} />
			</div>
		</div>
	)
}

const RenderDays = ({ currentMonth, viewMode }) => {
	const dateFormat = `E`
	const days = []

	let startDate = startOfWeek(new Date(currentMonth)) /* cloning date */

	for (let i = 0; i < 7; i++) {
		days.push(
			<div key={i} className={viewMode === `month` ? styles.dayOfWeek : styles.dayOfWeekColumn}>
				{format(addDays(startDate, i), dateFormat)}
			</div>
		)
	}

	return <div className={viewMode === `month` ? styles.weekdays : `${styles.weekView} ${styles.bold}`}>
		{viewMode === `week` && <div className={styles.weekView}></div>}
		{days}
	</div>
}

type renderCellsType = {
	currentDate : Date,
	eventsArr : eventType[],
	viewMode : `month` | `week`
}

type calendarDaysType = {
	dayOfMonth : Date,
	days : eventType[]
}

const RenderCells = ({ currentDate, eventsArr, viewMode } : renderCellsType) => {
	const [events, setEvents] = useState<eventType[]>(eventsArr)

	let { startDate, endDate } = getPeriodStartAndEnd(currentDate, viewMode)

	const rows : calendarDaysType[][] = []

	let dayOfMonth : Date = startDate

	const moveEvent = (event : eventType, newDay : Date) => {
		event.to = newDay
		event.from = newDay
		setEvents([...events])
	}

	while (dayOfMonth <= endDate) {
		let thisRow : calendarDaysType[] = []

		for (let i = 0; i < 7; i++) {
			dayOfMonth = addDays(dayOfMonth, 1)

			// days.push(events.filter((a) => format(a.from, `ddMyyyy`) === format(dayOfMonth, `ddMyyyy`)))

			thisRow.push({
				dayOfMonth,
				days: events.filter((a) => format(a.from, `ddMyyyy`) === format(dayOfMonth, `ddMyyyy`)),
			})
		}

		rows.push(thisRow)
		thisRow = []

		if (viewMode === `week`) break
	}

	if (viewMode === `week`) {
		return <WeekView rows={rows} currentDate={currentDate}/>
	} else {
		return <MonthView rows={rows} eventsArr={eventsArr} currentDate={currentDate} moveEvent={moveEvent}/>
	}
}

type weekViewType = {
	rows : calendarDaysType[][],
	currentDate : Date
}

function WeekView({ rows, currentDate } : weekViewType) {
	const daysOfWeek = []
	for (let i = 0; i < 7; i++) {
		daysOfWeek.push(addDays(startOfWeek(currentDate), i))
	}

	const hoursOfDay = Array.from({ length: 16 }, (_, i) => 7 + i) // From 7 AM to 10 PM

	return <div className={styles.weekView}>
		<div className={styles.timeColumn}>
			{hoursOfDay.map((hour) => (
				<div key={hour} className={styles.hourSlot}>
					{hour}:00
				</div>
			))}
		</div>
		{daysOfWeek.map((day) => (
			<div key={day} className={styles.dayColumn}>
				{hoursOfDay.map((hour) => {
					// const eventsInHour = rows.filter(
					// 	(e) => isSameDay(e.from, day) && getHours(e.from) === hour
					// )
					return (
						<div key={hour} className={styles.hourSlot}>
							{/* Render eventsInHour here */}
						</div>
					)
				})}
			</div>
		))}
	</div>
}

type monthViewType = {
	rows : calendarDaysType[][],
	eventsArr: eventType[],
	currentDate : Date,
	moveEvent : (event : eventType, newDay : Date) => void
}

function MonthView({ rows, eventsArr, currentDate, moveEvent } : monthViewType) {
	return <div className={styles.daysContainer}>
		{rows.map((a, index) => {
			return <div key={index} className={styles.days} style={{ minHeight: `${100 / rows.length}%`, maxHeight: `${100 / rows.length}%` }}>
				{a.map((b) => <Day key={b.dayOfMonth.toString()} day={b.dayOfMonth} events={b.days} moveEvent={moveEvent} />)}
			</div>
		})}
	</div>
}

function Calendar({ eventsArr = null } : calendarPropsType) {
	const [currentDate, setCurrentDate] = useState<Date>(new Date())
	const [viewMode, setViewMode] = useState<`month` | `week`>(`month`)

	const nextPeriod = () => {
		if (viewMode === `month`) {
			setCurrentDate(addMonths(currentDate, 1))
		} else {
			setCurrentDate(addWeeks(currentDate, 1))
		}
	}

	const prevPeriod = () => {
		if (viewMode === `month`) {
			setCurrentDate(subMonths(currentDate, 1))
		} else {
			setCurrentDate(subWeeks(currentDate, 1))
		}
	}

	const toggleViewMode = () => {
		setViewMode(viewMode === `month` ? `week` : `month`)
	}

	const nowPeriod = () => {
		setCurrentDate(new Date())
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={styles.calendar}>
				<RenderHeader
					currentDate={currentDate}
					nowPeriod={nowPeriod}
					nextPeriod={nextPeriod}
					prevPeriod={prevPeriod}
					toggleViewMode={toggleViewMode}
					viewMode={viewMode}
				/>
				<RenderDays currentMonth={currentDate} viewMode={viewMode}/>
				<RenderCells currentDate={currentDate} eventsArr={eventsArr} viewMode={viewMode}/>
			</div>
		</DndProvider>
	)
}

export default Calendar
