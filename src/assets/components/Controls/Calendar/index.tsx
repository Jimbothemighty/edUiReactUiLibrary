import { useState } from 'react'
import styles from './Calendar.module.css'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, addMonths, subMonths } from 'date-fns'
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

function Calendar({ eventsArr = null } : calendarPropsType) {
	const [currentMonth, setCurrentMonth] = useState(new Date())
	// const [events, setEvents] = useState<eventType[]>(eventsArr)

	const renderHeader = () => {
		const dateFormat = `MMMM yyyy`
		return (
			<div className={styles.header}>
				<div>{format(currentMonth, dateFormat)}</div>
				<div className={styles.buttonContainer}>
					<Button onClick={nowMonth} label={`Now`}/>
					<Button onClick={prevMonth} label={`Prev`}/>
					<Button onClick={nextMonth} label={`Next`}/>
				</div>
			</div>
		)
	}

	const renderDays = () => {
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

	const renderCells = (events : eventType[]) => {
		const monthStart : Date = startOfMonth(currentMonth)
		const monthEnd : Date = endOfMonth(monthStart)
		const startDate : Date = startOfWeek(monthStart)
		const endDate : Date = endOfWeek(monthEnd)

		const dateFormat = `d`
		const rows = []

		let days = []
		let day = startDate
		let formattedDate = ``

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				formattedDate = format(day, dateFormat)
				days.push(
					<div key={day.toString()} className={styles.day}>
						<div className={styles.dayInner}>
							{formattedDate}
							<br/>
							<div className={styles.dayEvents}>
								{
									events
										.filter((a) => format(a.from, `ddMyyyy`) === format(day, `ddMyyyy`))
										.map((event, index) => {
											return <div key={event.id} className={styles.event}>{event.label}</div>
										})
								}
							</div>
						</div>
					</div>
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
		<div className={styles.calendar}>
			{renderHeader()}
			{renderDays()}
			{renderCells(eventsArr)}
		</div>
	)
}

export default Calendar
