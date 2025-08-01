import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: [
      "#EF3A59", // 1 - Pinkish Red
      "#FF2E00", // 2 - Vivid Red-Orange
      "#FF7043", // 3 - Warm Orange
      "#FF5733", // 4 - Soft Red-Orange
      "#C62828", // 5 - Deep Red
      "#C16A6A", // 6 - Muted Brick Red
      "#EF3A59", // 7 - Repeated
      "#FF2E00", // 8 - Repeated
      "#FF7043", // 9 - Repeated
      "#FF5733", //10 - Repeated
      "#C62828", //11 - Repeated
      "#C16A6A", //12 - Repeated
    ],
    chart: {
      fontFamily: "kabob",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        distributed: true, // Allow color per bar
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: false, // Optional: since it's just one series
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={340} />
        </div>
      </div>
    </div>
  );
}
