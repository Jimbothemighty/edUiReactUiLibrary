import { useDispatch } from "react-redux"
import { setLoggedIn } from "~/redux/authentication"
import { AppDispatch } from "~/redux/store"

export function LogInForm() {
	const dispatch: AppDispatch = useDispatch()

	return <div className="LogInForm">
		<form>
			<h1>Log In Form</h1>
			<input type='email' placeholder='Email'/>
			<input type='password' placeholder='Password'/>
			<button onClick={() => {
				dispatch(setLoggedIn(true))
			}}>Log In</button>
		</form>
	</div>
}
