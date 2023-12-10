import { useSelector } from "react-redux"
import { RootState } from "~/redux/store"

type FooterElementObj = {
	text: string
}

interface FooterColumnProps {
	rows : Array<FooterElementObj>
}

function FooterColumnElement({ text } : FooterElementObj) {
	return <div className='FooterColumnElement'>{text}</div>
}

function FooterColumn({ rows = [] } : FooterColumnProps) {
	if (rows.length === 0) {
		return <div className="FooterColumn">Empty</div>
	}

	return <div className="FooterColumn">{
		rows.map((row : FooterElementObj, index) => {
			return <FooterColumnElement key={index} {...row}></FooterColumnElement>
		})}</div>
}

export function Footer() {
	const loggedIn = useSelector((state: RootState) => state.authentication.isLoggedIn)

	return <div className="Footer">
		<FooterColumn rows={[{ text: loggedIn ? `Log Out` : `Log In` }, { text: `Terms and Conditions` }, { text: `Privacy Policy` }]} />
		<FooterColumn rows={[]}></FooterColumn>
		<FooterColumn rows={[]}></FooterColumn>
	</div>
}
