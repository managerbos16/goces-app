// =====================================
// GOCES DASHBOARD MODULE
// =====================================

// Menyimpan instance Chart agar bisa di-destroy saat dashboard dibuka lagi
let dashboardChartObj = null;

// =====================================
// LOAD DASHBOARD
// =====================================

function loadDashboard() {

    loadEnterpriseChart();

}

// =====================================
// LOAD ENTERPRISE CHART
// =====================================

function loadEnterpriseChart() {

    const canvas = document.getElementById("entChart");

    // Kalau canvas belum ada, hentikan
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Hapus chart lama supaya tidak dobel
    if (dashboardChartObj) {

        dashboardChartObj.destroy();

    }

    dashboardChartObj = new Chart(ctx, {

        type: "line",

        data: {

            labels: [

                "Senin",
                "Selasa",
                "Rabu",
                "Kamis",
                "Jumat",
                "Sabtu",
                "Minggu"

            ],

            datasets: [

                {

                    label: "Volume Transaksi Masuk (Juta)",

                    data: [

                        32,
                        45,
                        41,
                        55,
                        68,
                        84,
                        91

                    ],

                    borderColor: "#2563EB",

                    backgroundColor: "rgba(37,99,235,.02)",

                    borderWidth: 2,

                    tension: .2,

                    fill: true

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    }

                },

                y: {

                    grid: {

                        color: "#F3F4F6"

                    }

                }

            }

        }

    });

}