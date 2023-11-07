
import "./ReportList.css"
import React, { useState, useEffect } from 'react';
//import API from 'aws-amplify';
import { useNavigate } from "react-router-dom"

const test_report_list = [{ "user_identifier": "", "report_id": "d542cfff-7dd5-4250-bf2a-436b1af70b18", "date_made": "2023-11-02T00:00:00.000Z", "file_name": "IAMANOTHERTEST" },
{ "user_identifier": "", "report_id": "d342cfff-7dd5-4250-bf2a-436b1af70b18", "date_made": "2023-11-02T00:00:00.000Z", "file_name": "IAMANOTHERTEST" },
{ "user_identifier": "", "report_id": "d642cfff-7dd5-4250-bf2a-436b1af70b18", "date_made": "2023-11-02T00:00:00.000Z", "file_name": "IAMANOTHERTEST" }
];
const report_presigned_url_TEST = "https://reportcybertool-cs490.s3.us-east-1.amazonaws.com/reports/d542cfff-7dd5-4250-bf2a-436b1af70b18?x-id=GetObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAWCSJBQIDHPJZD3M4%2F20231107%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231107T175053Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=07f30a2eacc1bd4231e38a59188110ebdcf35c882457afd881d2f50bcd36b5e1&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLWVhc3QtMSJGMEQCIAIWa4BhybeUR4tO7txIXW9QsyOgkXIcj%2F1v2BRtKhsbAiAoKNRpW6pVsG4R0SdoKV6Lgp9nXm4%2Brvb1VB5jiPdB6yqNAwir%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDQxNzgzODc2MDQ1NCIM2ZvI3ybbOQBbGf7wKuECNhBcW8hDn9FrXA0iNuM7ufXcKc83lPI8iix%2B8lP%2BKUgWUc%2Bo2R%2B8YpB7zUl3xo9%2BE1VvQdqnPYa8fudBgoJcKgXhFUfnpl5%2FWTiuMXO41AKbUSZRP4NtSnCmjjhNhBlx3%2BPPa86IlFCrlDOs6ll3n5JdbMIwdTczPDoPM%2Fp1KFEBuvnYl4VXHpFkG6J9HSjCB90xqsQY%2F37NTmYhovkZtoMqY1QV88DkuQ4IuVVxMHCEEwqm7Q%2FlURt1EwdQdfRGWxK%2BrxJjBCj58MGn3r10dnMHTP7Wj1pozbP7ANXSSWv8mnzMRO2QK0HufaDP%2BfanA77MZnRKpYekRMtiTT5HGx3KKxIqbE9OTxe60mJW7la3MyqxDHWsaJik4G3BeoW8jXngEO9%2F45QojCbalCqkEpcuGr5HUBNk895bAby7DHr5188r51H%2F6Wq7eYja0THSbdDcftM%2FbIP6Eolt8au3S%2FEw%2FPGpqgY6nwEgqtUBPzsHwFH7RWy02IY6xcgsDFNjzsDZE%2BYpQa46dSt04KGf5c%2FTKkUFtGORBCq4%2BWwALAlbTu1M5d0ARWVE4CPrmL6v6ZzaWl78YY090DJJgri2bc4cFTgnHGaYCB4H8ByexTF%2B%2Fp1NDT3K0W730H1IKzSMss%2F1QzFobvXXJAdREICnakRVkcDce%2FOpcqEfpaAWMb2Dt5gfJfv%2BIgc%3D";

const ReportList = () => {
  const navigate = useNavigate();

  const [reportListArray, setReportListArray] = useState([]);

  useEffect(() => {
    fetchReportList();
  }, []);

  const handleDashboardClick = async () => {
    navigate("/Dashboard")
  }

  const fetchReportList = async () => {
    try {
      // Api call
      //const reportData = 0;
      //const reportList = [];
      setReportListArray(test_report_list);
    }
    catch (error) {
      alert('Unable to retrieve report list')
    }
  }

  const fetchPreSignedUrl = async (report_id) => {
    try {
      //Api call here
      //console.log(report_id);
      //Download the document
      window.location.href = report_presigned_url_TEST;
    } catch (error) {
      alert('Unable to retrieve presigned url')
    }
  }

  return (
    <div>
      <div>
      </div>
      <h1>Report Dashboard</h1>
      <button onClick={handleDashboardClick}>Dashboard</button>

      <button onClick={fetchReportList}>
        Refresh
      </button>
      <table className="styled-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Created</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {reportListArray.map((report, index) => (
            <tr key={index}>
              <td>{report.file_name}</td>
              <td>{new Date(report.date_made).toLocaleDateString()}</td>
              <td>
                <button onClick={() => fetchPreSignedUrl(report.report_id)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ReportList;
