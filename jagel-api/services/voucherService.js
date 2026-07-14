async function voucherService(req) {

    return [

        {
            id: 1,
            title: "Diskon Hingga Rp50.000",
            description: "Minimal pembelian Rp100.000",
            image: "https://res.cloudinary.com/dutuhbbg2/image/upload/v1781361458/file_000000008fec7207bb115726bf6c2a8d_k8vevm.png",
            badge: "Diskon 50%",
            badgeType: "discount",
            tag: "🔥 Terlaris",
            tagType: "hot",
            ribbon: "HOT",
            code: "MAKAN50",
            period: "21 Juni - 1 Juli 2026",
            startDate: "2026-07-21 00:00:00",
            endDate: "2026-12-01 23:59:59",
            minimumOrder: 100000,
            maximumDiscount: 50000,
            terms: [
                "Berlaku untuk semua merchant makanan",
                "Tidak dapat digabung dengan promo lain",
                "Maksimal 1x penggunaan per akun"
            ]

        },

        {
            id: 2,
            title: "Diskon Hingga Rp50.000",
            description: "Minimal pembelian Rp100.000",
            image: "https://res.cloudinary.com/dutuhbbg2/image/upload/v1781361458/file_000000008fec7207bb115726bf6c2a8d_k8vevm.png",
            badge: "Diskon 50%",
            badgeType: "discount",
            tag: "🔥 Terlaris",
            tagType: "hot",
            ribbon: "HOT",
            code: "MAKAN50",
            period: "21 Juni - 1 Juli 2026",
            startDate: "2026-07-21 00:00:00",
            endDate: "2026-12-01 23:59:59",
            minimumOrder: 100000,
            maximumDiscount: 50000,
            terms: [
                "Berlaku untuk semua merchant makanan",
                "Tidak dapat digabung dengan promo lain",
                "Maksimal 1x penggunaan per akun"
            ]

        }

    ];

}

module.exports = voucherService;