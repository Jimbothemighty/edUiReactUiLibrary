import { useDispatch } from "react-redux"
import { setLoggedIn } from "~/redux/authentication"
import { AppDispatch } from "~/redux/store"

export function LoggedInApp() {
	const dispatch: AppDispatch = useDispatch()

	return <div className="LoggedInApp">
		<h1>You are logged in</h1>
		<button onClick={() => {
			dispatch(setLoggedIn(false))
		}}>Log Out</button>
	</div>
}
