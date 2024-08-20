import { CaseObject } from "../../CasesView";
import "./Row.css";

function Row({ row }) {
    console.log({ row });
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
