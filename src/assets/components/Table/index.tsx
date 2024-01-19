import * as React from 'react'
import styles from './Table.module.css'

export interface TableColumn {
	key: string;
	label: string;
	dataType?: `string` | `number` | `boolean`; // You can extend this for other data types
	hidden?: boolean;
}

interface TableProps {
  headers: TableColumn[];
  data: { [key: string]: any }[];
}

export const Table: React.FC<TableProps> = ({ headers, data }) => {
	const [sortConfig, setSortConfig] = React.useState({ key: ``, direction: `ascending` })
	const [filters, setFilters] = React.useState({})
	const visibleHeaders = headers.filter((header) => !header.hidden)

	const handleFilterChange = (e, key, value) => {
		debugger
		e.stopPropagation()
		setFilters({ ...filters, [key]: value })
	}

	const filteredData = React.useMemo(() => {
		return data.filter((row) => {
			return Object.entries(filters).every(([key, value]) => {
				if (!value) return true
				if (row[key] == null) return false
				return row[key].toString().toLowerCase().includes(value.toLowerCase())
			})
		})
	}, [data, filters])

	const sortedData = React.useMemo(() => {
		let sortableItems = [...filteredData]
		if (sortConfig.key) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === `ascending` ? -1 : 1
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === `ascending` ? 1 : -1
				}
				return 0
			})
		}
		return sortableItems
	}, [filteredData, sortConfig])

	const requestSort = (key) => {
		let direction = `ascending`
		if (sortConfig.key === key && sortConfig.direction === `ascending`) {
			direction = `descending`
		}
		setSortConfig({ key, direction })
	}

	return (
		<table className={styles.table}>
			<thead>
				<tr>
					{visibleHeaders.map((header, index) => (
						<th key={index} onClick={() => requestSort(header.key)}>
							<div>
								{header.label}
								<input
									type="text"
									value={filters[header.key] || ``}
									onClick={(e) => e.stopPropagation()}
									onChange={(e) => handleFilterChange(e, header.key, e.target.value)}
								/>
							</div>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{sortedData.map((row, rowIndex) => (
					<tr key={rowIndex}>
						{visibleHeaders.map((header, columnIndex) => (
							<td key={columnIndex}>{row[header.key]}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}
