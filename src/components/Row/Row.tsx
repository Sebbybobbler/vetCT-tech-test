import { CaseObject } from "../../CasesView";
import { NavLink } from "react-router-dom";
import "../../assets/css/Row.css";

function Row({ row }: { row: CaseObject["data"][0] }) {
  const link: string = row.id;
  return (
    <tr>
      <td>{row.case_key}</td>
      <td>{row.patient}</td>
      <td>{row.owner}</td>
      <td>{row.specialty}</td>
      <td>{row.creation_date}</td>
      <td>
        <NavLink className="casesPrimaryButton" to={link}>
          View
        </NavLink>
      </td>
    </tr>
  );
}

export default Row;
