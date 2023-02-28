import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { pb } from "./Config";
import { computeNiceExpiryDate } from "./Utils";

const CreateEntry = ({userId, authValid}) => {
    // Data
    const [dbName, setDbName] = useState('');
    const [expiryDate, setExpiryDate] = useState(null);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const [errorState, setErrorState] = useState('');

    // Fetch DB names currently in use
    const [usedDbNames, setUsedDbNames] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try {
                let items = await pb.collection('instances').getFullList();
                setUsedDbNames(items.map((entry) => {return (entry.dbName)}))
            } catch (e) {
                if (e.status === 0){
                    console.log('PB SDK auto-reject: multiple calls at once')
                } else {
                    console.error(e);
                }
            }
        }    
        getData();
    }, [userId]);

    // Validations
    const [dbNameIsLongEnough, setDbNameIsLongEnough] = useState(false);
    const [dbNameIsUnique, setDbNameIsUnique] = useState(true);
    const [dbNameIsRegexValid, setDbNameIsRegexValid] = useState(false);
    const [formReady, setFormReady] = useState(false);
    useEffect(() => {
        setDbNameIsRegexValid(dbName.match(/^[a-z]+$/) !== null)
        setDbNameIsUnique(!usedDbNames.includes(dbName))
        setDbNameIsLongEnough(
            (dbName.length >=5) && (dbName.length <=28) 
            );
        setFormReady(
            dbNameIsLongEnough & (expiryDate!=null) & dbNameIsUnique & dbNameIsRegexValid
            );
        }, [dbName,
            usedDbNames,
            dbNameIsLongEnough,
            dbNameIsUnique,
            expiryDate,
            formReady
        ], [userId]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dbEntry = {
            creatorUserId:userId,
            dbName,
            dbUser:dbName,
            description,
            dbPassword: uuidv4(),
            expiryDate
        }

        var resp = await pb.collection('instances').create(dbEntry)
        .then(() => {navigate("/")})
        .catch((error) => {
            if (error.data.data.dbName.message !== undefined){
                console.log(error.data)
                setErrorState("The DB name given might be in use by a different user, try with a different value.")
            }
            else {
                if (error.status === 400){
                    setErrorState("Creation failed due to improper request. Contact support with details of given parameters.")
                }
                else {
                    setErrorState("Unknown error occurred. Contact support with specific time and date of the incident for troubleshooting.")
                }
            }
        }
        )
    }

    return (
        <div className="create-entry container m-2">
            <h2 className="mt-5">Create a database</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
                <label>User ID (automatically assigned based on your login)</label>
                <input className="form-control" type="text" value={userId} readOnly disabled/>
                {(userId === null) && <p className="text-danger fw-bold"> You must be logged in to create an instance. </p>}
            </div>
            
            {/* Validate the name */}
            <div className="form-group mt-3">
                <label>Name of your database (will also be the name of your db user)</label>
                <input className="form-control" type="text" placeholder="client-project-db" onChange={(e) => setDbName(e.target.value)}/>
                {!dbNameIsLongEnough && <p className="text-danger fw-bold"> DB Name must be longer than 5 and shorter than 28 characters.</p>}
                {!dbNameIsRegexValid && <p className="text-danger fw-bold"> DB Name must consist of lowercase characters only</p>}
                {!dbNameIsUnique && <p className="text-danger fw-bold"> DB Name must be unique</p>}
            </div>

            <div className="form-group mt-3">
                <label>Description of intended usage - Office location, project type, etc.</label>
                <input className="form-control" type="text" placeholder="Internal POC / dashboard for an event" onChange={(e) => setDescription(e.target.value)}/>
            </div>

            {/* Create password */}
            {/* Validate that one button is checked */}
            <label className="mt-3">Expiry date for this database after which it is deleted</label>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"
                onChange={(e) => setExpiryDate(computeNiceExpiryDate(1))}/>
                1 month (deletes on {computeNiceExpiryDate(1)})
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"
                onChange={(e) => setExpiryDate(computeNiceExpiryDate(3))}/>
                3 months (deletes on {computeNiceExpiryDate(3)})
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"
                onChange={(e) => setExpiryDate(computeNiceExpiryDate(6))}/>
                6 months (deletes on {computeNiceExpiryDate(6)})
            </div>
            {expiryDate===null && <p className="text-danger fw-bold"> You must choose an expiry date</p>}
            <button type="submit" className="btn btn-success mb-2 mt-3" disabled={!formReady}>Send request</button>
        </form>

        
        {errorState !== '' && <div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Creation failed.</strong>  {errorState}</div>}
        </div>
    );
}

export default CreateEntry;