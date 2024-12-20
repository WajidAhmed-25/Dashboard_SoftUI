/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const reportsBarChartData = {
  chart: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: { label: "Sales", data: [450, 200, 100, 220, 500, 100, 400, 230, 500] },
  },
  items: [
    {
      icon: { color: "primary", component: "library_books" },
      label: "Active Designer",
      progress: { content: "36K", percentage: 60 },
    },
    {
      icon: { color: "info", component: "touch_app" },
      label: "Active Digitizing",
      progress: { content: "2M", percentage: 90 },
    },
    {
      icon: { color: "warning", component: "payment" },
      label: "Active Vector",
      progress: { content: "$435", percentage: 30 },
    },
  ],
};

export default reportsBarChartData;
