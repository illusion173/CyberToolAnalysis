
import "./ReportList.css"
const reportlist = () => {
  return (
    <div>
      <h1>Report List</h1>
      <table class="styled-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Created</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dom</td>
            <td>6000</td>
            <td>test</td>
          </tr>
          <tr>
            <td>Melissa</td>
            <td>5150</td>
            <td>test</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};
export default reportlist;