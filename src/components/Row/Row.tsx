import { CaseObject } from "../../CasesView";
import "./Row.css";

function Row({ row }: { row: CaseObject["data"][0] }) {
    return (
        <>
            <tr>
                <td>{row.case_key}</td>
                <td>{row.patient}</td>
                <td>{row.owner}</td>
                <td>{row.specialty}</td>
                <td>{row.creation_date}</td>
                <td>
                    <button>View</button>
                </td>
            </tr>
        </>
    );
}

export default Row;
