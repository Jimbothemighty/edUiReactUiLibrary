import { useState } from "react"
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './Kanban.module.css'

const DraggableCard = ({ card }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: `card`,
		item: card,
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
		<div ref={drag} className={styles.card} style={{ opacity: isDragging ? 0.5 : 1 }}>
			{card.content}
		</div>
	)
}

const Column = ({ column, cards, moveCard }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: `card`,
		drop: (item) => {
			if (item) {
				moveCard(item, column)
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}))

	return (
		<div ref={drop} className={styles.column}>
			<h3 className={styles.columnHeader}>{column.title}</h3>
			{cards.map(card => <DraggableCard key={card.id} card={card} />)}
		</div>
	)
}

const Kanban = ({ initialColumns, initialCards }) => {
	const [columns, setColumns] = useState(initialColumns)
	const [cards, setCards] = useState(initialCards)

	const moveCard = (card, column) => {
		card.status = column.id
		setCards([...cards])
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={styles.board}>
				{columns.map(column => (
					<Column key={column.id} column={column} moveCard={moveCard} cards={cards.filter(card => column.id.includes(card.status))} />
				))}
			</div>
		</DndProvider>
	)
}

export default Kanban
