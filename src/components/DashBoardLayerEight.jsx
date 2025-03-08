import React from "react";
import BPMDisplay from "./child/BPMDisplay"; // Optional simple BPM card
import BPMChartLine from "./child/BPMChartLine"; // Option 1: Line chart
import ECGWaveformChart from "./child/ECGWaveformChart"; // Option 2: Area chart
import BPMDonut from "./child/BPMDonut"; // The new donut-based BPM chart
import UnitCountSix from "./child/UnitCountSix";
import EarningStatistic from "./child/EarningStatistic";
import PatientVisitedDepartment from "./child/PatientVisitedbyDepartment";
import PatientVisitByGender from "./child/PatientVisitByGender";
import TopPerformanceTwo from "./child/TopPerformanceTwo";
import LatestAppointmentsOne from "./child/LatestAppointmentsOne";
//import TotalIncome from "./child/TotalIncome";
import AvailableTreatments from "./child/AvailableTreatments";
import HealthReportsDocument from "./child/HealthReportsDocument";

const DashBoardLayerEight = () => {
  return (
    <>
      <div className="row gy-4">
        <div className="col-xxxl-9">
          <div className="row gy-4">
            {/* You can choose either the line chart or the area chart, or both */}
            <BPMDisplay />
            <BPMChartLine />
            {/* Or to use the area chart, comment out the line chart and uncomment below: */}
            {
            <ECGWaveformChart />
            }
            <UnitCountSix />
            <EarningStatistic />
            <PatientVisitedDepartment />
            <PatientVisitByGender />
            <TopPerformanceTwo />
            <LatestAppointmentsOne />
          </div>
        </div>
        <div className="col-xxxl-3">
          <div className="row gy-4">
            <BPMDonut  />
            <AvailableTreatments />
            <HealthReportsDocument />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardLayerEight;
