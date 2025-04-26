import React from "react";
import BPMDisplay from "./child/BPMDisplay"; // Optional simple BPM card / updated for FECG V2
import BPMChartLine from "./child/BPMChartLine"; // Option 1: Line chart / updated for FECG V2
import ECGWaveformChart from "./child/ECGWaveformChart"; // Option 2: Area chart / updated for FECG V2
import BPMDonut from "./child/BPMDonut"; // The new donut-based BPM chart / updated for FECG V2
import BPMMetricsOverview from "./child/BPMMetricsOverview";
import BPMStatistic from "./child/BPMStatistic";
import PatientVisitedDepartment from "./child/PatientVisitedbyDepartment";
import PatientVisitByGender from "./child/PatientVisitByGender";
import TopPerformanceTwo from "./child/TopPerformanceTwo";
import LatestAppointmentsOne from "./child/LatestAppointmentsOne";
import Last24hBPM from "./child/Last24hBPM";
import BPMSummaryReports from "./child/BPMSummaryReports";

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
            <BPMMetricsOverview />
            <BPMStatistic />
            <PatientVisitedDepartment />
            <PatientVisitByGender />
            <TopPerformanceTwo />
            <LatestAppointmentsOne />
          </div>
        </div>
        <div className="col-xxxl-3">
          <div className="row gy-4">
            <BPMDonut  />
            <Last24hBPM />
            <BPMSummaryReports />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardLayerEight;
