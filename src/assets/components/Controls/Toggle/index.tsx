import { useState } from "react"
import styles from "./Toggle.module.css"

export function Toggle({ onToggle }) {
	const [checked, setChecked] = useState(false)
	const thisId = Math.random().toString(16).slice(2)

	return <div className={styles.toggleContainer}>
		<input type="checkbox" className={styles.checkbox} id={thisId} checked={checked}
			onChange={(event) => {
				setChecked(event.target.checked)
				onToggle(checked)
			}} />
		<label htmlFor={thisId} className={styles.checkboxLabel}>
			<span className={`${styles.emoji} ${styles.left}`}>✔️</span>
			<span className={`${styles.emoji} ${styles.right}`}>❌</span>
			<span className={styles.ball}></span>
		</label>
	</div>
}
