import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Mail,
  Download,
} from "lucide-react";

export default function ExecutiveReports() {

  function handleExport(type) {

    console.log(`Export ${type}`);

    alert(
      `${type} export will be connected in the next phase.`
    );

  }

  const reports = [

    {
      title: "Executive PDF Report",
      description:
        "Generate a professional executive business report.",
      icon: <FileText size={26} />,
      color: "bg-red-600",
      action: () => handleExport("PDF"),
    },

    {
      title: "Excel Report",
      description:
        "Export KPI and financial data to Excel.",
      icon: <FileSpreadsheet size={26} />,
      color: "bg-green-600",
      action: () => handleExport("Excel"),
    },

    {
      title: "PowerPoint Report",
      description:
        "Generate presentation slides for management meetings.",
      icon: <Presentation size={26} />,
      color: "bg-orange-600",
      action: () => handleExport("PowerPoint"),
    },

    {
      title: "Email Report",
      description:
        "Email the executive report to management.",
      icon: <Mail size={26} />,
      color: "bg-blue-600",
      action: () => handleExport("Email"),
    },

  ];

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-semibold">

          Executive Reports

        </h2>

        <Download size={24} />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {reports.map((report) => (

          <div
            key={report.title}
            className="border rounded-xl p-5 hover:shadow-lg transition"
          >

            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${report.color}`}
            >

              {report.icon}

            </div>

            <h3 className="text-lg font-semibold mt-4">

              {report.title}

            </h3>

            <p className="text-gray-500 mt-2">

              {report.description}

            </p>

            <button
              onClick={report.action}
              className="mt-5 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >

              Generate

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}