import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "./Config";
import { computeDayDiffFromStringDates, formatUnixDate } from "./Utils";

const ListView = ({authValid}) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        const getData = async () => {
            try {
                setData(
                    await pb.collection('instances').getFullList({
                        sort: 'dbDeleted,deletionRequestDate,-dbProvisioned,+expiryDate',
                        expand: 'creatorUserId'
                    })
                    );
                setFilteredData(data)
            } catch (e) {
                if (e.status === 0){
                    console.log('PB SDK auto-reject: multiple calls at once')
                } else {
                    console.error(e);
                }
            }
        }
        getData();
    }, [authValid]);
    
    function gotoDetails(id) {
        navigate("/entries/"+id);
    }

    useEffect(() => {
        if (searchTerm === ''){
            setFilteredData(data)
            console.log('search term is blank')
        }
        else {
            var results = data.filter(function (entry){
                return entry.id.toLowerCase().includes(searchTerm) ||
                    entry.dbName.toLowerCase().includes(searchTerm) ||
                    entry.description.toLowerCase().includes(searchTerm)
            })
            setFilteredData(results)
        }
    }, [searchTerm, data])

    return (
        <div className="listview px-5">
            <h2 className="mt-5">Current instances</h2>
            <div className="input-group m-2">
                <input type="text" className="form-control" placeholder="Search by ID, name or description" aria-label="Search" onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}/>
            </div>

            <table className="table table-bordered table-hover m-2">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Database ID</th>
                    <th scope="col">Creator user ID</th>
                    <th scope="col">DB Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Creation date</th>
                    <th scope="col">Expiry date</th>
                    <th scope="col">Remaining lifetime (days)</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((entry) => {
                    return (
                        <tr className={
                            entry.dbDeleted ? " table-danger" : "" 
                            + entry.deletionRequestDate !== "" ? " table-warning": ""
                            + (!entry.dbProvisioned && " table-info")
                            } key={entry.id} onClick={entry.dbDeleted ? undefined : () => gotoDetails(entry.id)}>
                            <td>{entry.id.slice(0,10)+"..." }</td>
                            <td>{(entry.expand.creatorUserId !== undefined) && entry.expand.creatorUserId.username}</td>
                            <td>{entry.dbName}</td>
                            <td>{entry.description}</td>
                            <td>{formatUnixDate(Date.parse(entry.created))}</td>
                            <td>{formatUnixDate(Date.parse(entry.expiryDate))}</td>
                            <td>{computeDayDiffFromStringDates(entry.expiryDate, entry.created)}</td>
                        </tr>
                    );
                })}
            </tbody>
            </table>

            <p className="container text-center fst-italic text-muted">
                Click on an entry to view its details. All dates and times are in UTC, today is {formatUnixDate(Date.now())}.
                <br/>
                Instances being provisioned are highlighted in <span className="text-info fw-bolder">blue.</span> Deleted instances are highlighted in <span className="text-danger fw-bold">red</span>, instances for which deletion was requested are highlighted in <span className="text-warning fw-bold">yellow</span>.
            </p>
        </div>
    );
}
 
export default ListView;