import { useParams, NavLink } from "react-router-dom";
import { makeApiRequest } from "./services/apiService";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "/assets/css/SingleCaseView.css";
import Header from "./components/Header/Header";

export type detailedCaseObject = {
  data: {
    id: string;
    creation_date: string;
    case_key: string;
    patient: string;
    status: string;
    specialty: string;
    owner: string;
    reporting_specialist: string;
    species: string;
    body_areas: string;
    turnaround: string;
    reported_date: string;
    image_url: string;
  };
};

function SingleCaseView() {
  // State which monitors query parameters, used in fetch request for patient info
  const { caseId } = useParams();
  // State which stores and sets the API response
  const [detailedResponse, setDetailedResponse] =
    useState<detailedCaseObject | null>(null);

  // On page load, or if query parameters change, a rquest is sent to API. This returns all the information and sets it in state hook.
  useEffect(() => {
    async function initialDetailedRequest(): Promise<detailedCaseObject | null> {
      const detailedRequest: Promise<detailedCaseObject | null> =
        await makeApiRequest(`/${caseId}`);
      setDetailedResponse(await detailedRequest);
      return detailedRequest;
    }
    initialDetailedRequest();
  }, [caseId]);

  if (!detailedResponse) {
    return (
      <>
        <Header />
        <div>
          <p>Loading...</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="patientContainer">
          <div className="homePageReturn">
            <NavLink to={"/"} aria-label="Home Page Button">
              <FontAwesomeIcon
                className="pageIcon"
                icon={faCircleArrowLeft}
                aria-label="Home Page button Icon, Left pointing arrow"
              />
            </NavLink>
          </div>
          <div className="patientInfoBox">
            <div className="patientInfoHead">
              <img
                className="patientImage"
                src={detailedResponse.data.image_url}
                alt="image of patient"
              />
              <h1 className="patientInfoItem patientInfoName">
                {detailedResponse.data.patient}
              </h1>
            </div>
            <div className="patientInfoBody">
              <div className="patientInfoLeft">
                <h3 className="patientInfoItem">
                  <p>Owner</p> {detailedResponse.data.owner}
                </h3>
                <h3 className="patientInfoItem">
                  <p>Species</p> {detailedResponse.data.species}
                </h3>
              </div>
              <div className="patientInfoRight">
                <h2
                  className={`${
                    detailedResponse.data.turnaround == "Urgent"
                      ? "patientTurnaroundUrgent"
                      : "patientTurnaroundStandard"
                  } patientInfoItem  }`}
                >
                  {detailedResponse.data.turnaround}
                </h2>
                <h3 className="patientInfoItem">
                  <p>Created</p> {detailedResponse.data.creation_date}{" "}
                </h3>
              </div>
            </div>
          </div>
          <div className="patientReportContainer">
            <div className="patientReport">
              <h3 className="patientReportItem">
                <p>Specialist</p> {detailedResponse.data.reporting_specialist} (
                {detailedResponse.data.specialty})
              </h3>
              <h3 className="patientReportItem isCentered">
                <p>Body Areas</p> {detailedResponse.data.body_areas}
              </h3>
            </div>
            <div className="patientReportStatus">
              <h3 className="patientReportItem">
                <p>Report Date</p> {detailedResponse.data.reported_date}
              </h3>
              <h2> {detailedResponse.data.status}</h2>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SingleCaseView;
