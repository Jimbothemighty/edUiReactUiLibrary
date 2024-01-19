import { useState, ReactNode } from 'react'
import styles from './Calendar.module.css'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, addMonths, subMonths } from 'date-fns'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Button from '~/assets/components/Controls/Button'

export type eventType = {
	id : number,
	from : Date,
	to : Date,
	label: string
}

type calendarPropsType = {
	eventsArr : eventType[]
}

type calendarDaysType = {
	day : Date,
	days : ReactNode
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

const RenderHeader = ({ currentMonth, nowMonth, prevMonth, nextMonth }) => {
	const dateFormat = `MMMM yyyy`
	return (
		<div className={styles.header}>
			<h2>{format(currentMonth, dateFormat)}</h2>
			<div className={styles.buttonContainer}>
				<Button onClick={nowMonth} label={`Now`}/>
				<Button onClick={prevMonth} label={`Prev`}/>
				<Button onClick={nextMonth} label={`Next`}/>
			</div>
		</div>
	)
}

const RenderDays = ({ currentMonth }) => {
	const dateFormat = `E`
	const days = []

	let startDate = startOfWeek(new Date(currentMonth)) /* cloning date */

	for (let i = 0; i < 7; i++) {
		days.push(
			<div key={i} className={styles.dayOfWeek}>
				{format(addDays(startDate, i), dateFormat)}
			</div>
		)
	}

	return <div className={styles.weekdays}>{days}</div>
}

type renderCellsType = {
	currentMonth : Date,
	eventsArr : eventType[]
}

const RenderCells = ({ currentMonth, eventsArr } : renderCellsType) => {
	const [events, setEvents] = useState<eventType[]>(eventsArr)

	const monthStart : Date = startOfMonth(currentMonth)
	const monthEnd : Date = endOfMonth(monthStart)
	const startDate : Date = startOfWeek(monthStart)
	const endDate : Date = endOfWeek(monthEnd)

	const rows : calendarDaysType[] = []

	let days : ReactNode[] = []
	let day : Date = startDate

	const moveEvent = (event : eventType, newDay : Date) => {
		event.to = newDay
		event.from = newDay
		setEvents([...events])
	}

	while (day <= endDate) {
		for (let i = 0; i < 7; i++) {
			days.push(
				<Day key={day.toString()} day={day} events={events.filter((a) => format(a.from, `ddMyyyy`) === format(day, `ddMyyyy`))} moveEvent={moveEvent} />
			)
			day = addDays(day, 1)
		}
		rows.push({
			day,
			days,
		})
		days = []
	}

	return <div className={styles.daysContainer}>{rows.map((a) => {
		return <div key={a.day.toString()} className={styles.days} style={{ minHeight: `${100 / rows.length}%`, maxHeight: `${100 / rows.length}%` }}>
			{a.days}
		</div>
	})}</div>
}

function Calendar({ eventsArr = null } : calendarPropsType) {
	const [currentMonth, setCurrentMonth] = useState(new Date())

	const nowMonth = () => {
		setCurrentMonth(new Date())
	}

	const nextMonth = () => {
		setCurrentMonth(addMonths(currentMonth, 1))
	}

	const prevMonth = () => {
		setCurrentMonth(subMonths(currentMonth, 1))
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={styles.calendar}>
				<RenderHeader currentMonth={currentMonth} nowMonth={nowMonth} nextMonth={nextMonth} prevMonth={prevMonth}/>
				<RenderDays currentMonth={currentMonth}/>
				<RenderCells currentMonth={currentMonth} eventsArr={eventsArr}/>
			</div>
		</DndProvider>
	)
}

export default Calendar
