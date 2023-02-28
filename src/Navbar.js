import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "./Config";

const Navbar = ({setAuthValid, setUserId}) => {

    // Temporary for login support
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = () => {
        pb.collection('users').authWithPassword(
            user,
            password
            )
        setAuthValid(pb.authStore.isValid)
        setUserId((pb.authStore.model !== null) ? pb.authStore.model.id : null)
        console.log(`succesful login as ${user}`)
        console.log(`authstore validity: ${pb.authStore.isValid}`)
    }

    const handleLogout = () => {
        pb.authStore.clear()
        setAuthValid(pb.authStore.isValid)
        setUserId((pb.authStore.model !== null) ? pb.authStore.model.id : null)
        console.log('logged out')
        console.log(`authstore validity: ${pb.authStore.isValid}`)
    }

    return (
        <div className="navigation">
            <nav className="navbar p-2 navbar-dark bg-dark">
                <div className="navbar-expand col-4">
                <ul className="navbar-nav">
                    <li>
                        <a href="/create" className="btn btn-success">Create a DB</a>
                    </li>
                    <li className="px-3">
                        <a href="/" className="btn btn-secondary">List DBs</a>
                    </li>
                {/* <form className="form-inline">
                    <input type="search" className="form-control mr-sm-2" placeholder="Search for a DB.." aria-label="Search"/>
                </form> */}
                </ul>
                </div>
                {pb.authStore.isValid && <div className="text-light">
                Logged in as: {pb.authStore.model.username}
                <br/>{pb.authStore.model.id}
                </div>}

            <form className="form-inline navbar-expand">
                <ul className="navbar-nav">
                    {(!pb.authStore.isValid) && <li className="px-3"><input type="text" className="form-control" placeholder="User" aria-label="user" onChange={(e) => setUser(e.target.value)}/></li>}
                    {(!pb.authStore.isValid) && <li><input type="password" className="form-control" placeholder="Password" aria-label="password" onChange={(e) => setPassword(e.target.value)}/></li>}
                    {(!pb.authStore.isValid) && <li className="px-3"><button type="button" onClick={() => {handleLogin()}} className="btn btn-success">Login</button></li>}
                    {pb.authStore.isValid && <li><button type="button" onClick={() => {handleLogout()}} className="btn btn-warning">Logout</button></li>}
                </ul>
            </form>
            
            </nav>
        </div>
    );
}

export default Navbar;