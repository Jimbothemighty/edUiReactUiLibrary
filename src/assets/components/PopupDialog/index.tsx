import styles from './PopupDialog.module.css'
import * as React from 'react'

interface PopupDialogProps {
  isOpen: boolean;
  onClose: (answer: boolean) => void;
}

const PopupDialog: React.FC<PopupDialogProps> = ({ isOpen, onClose }) => {
	const handleConfirm = () => {
		handleClose(true)
	}

	const handleCancel = () => {
		handleClose(false)
	}

	const handleClose = (ans : boolean) => {
		onClose(Boolean(ans))
	}

	return (
		isOpen && (
			<div className={styles.popupContainer}>
				<div className={styles.popupContent}>
					<p>Are you sure you want to proceed?</p>
					<button onClick={handleConfirm}>Yes</button>
					<button onClick={handleCancel}>No</button>
				</div>
			</div>
		)
	)
}

export { PopupDialog }
