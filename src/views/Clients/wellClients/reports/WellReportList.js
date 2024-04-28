const { useLocation } = require("react-router-dom")


function WellReportList() {
  const location = useLocation();
  const well = location.state.well;
  const wellReports = well.wellData
  console.log(wellReports);

  return (
    <div>
      {
        wellReports.length > 0 ? wellReports.map(report => (
          <div key={report.id} className='border-b-2 border-gray-200 p-2 shadow-xl mt-2'>
            <div className='text-lg'>Report ID: {report.id}</div>
            <div className='text-lg'>Report Code: {report.code}</div>
            <div className='text-lg'>Report Date: {report.date}</div>
            <div className='text-lg'>Report Hour: {report.hour}</div>
            <div className='text-lg'>Report Totalizador: {report.totalizador}</div>
            <div className='text-lg'>Report Caudal: {report.caudal}</div>
            <div className='text-lg'>Report Nivel Freatico: {report.nivel_freatico}</div>
          </div>
        )) : <div>No reports found</div>
      }
    </div>
  )
}

export default WellReportList