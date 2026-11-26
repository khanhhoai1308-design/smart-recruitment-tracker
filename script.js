
// ====================================
// 1. KHAI BÁO DỮ LIỆU
// ====================================

const departments = [
    "Truyền thông",
    "Sự kiện",
    "Chuyên môn",
    "Đối ngoại",
    "Nhân sự"
];

const statuses = [
    "Chờ xét duyệt",
    "Qua vòng đơn",
    "Phỏng vấn",
    "Trúng tuyển",
    "Không đạt"
];


// ====================================
// 2. TẠO DỮ LIỆU GIẢ LẬP
// ====================================

function randomItem(array) {
    return array[
        Math.floor(Math.random() * array.length)
    ];
}

function generateApplicants(count) {

    const data = [];

    for (let i = 1; i <= count; i++) {

        const number = String(i).padStart(3, "0");

        data.push({
            id: "UV" + number,
            name: "Ứng viên " + number,
            department: randomItem(departments),
            score: Math.floor(Math.random() * 61) + 40,
            status: randomItem(statuses)
        });
    }

    return data;
}

// ====================================
// LƯU TRỮ DỮ LIỆU LOCALSTORAGE
// ====================================

const STORAGE_KEY = "smartRecruitmentData";

function loadData() {

    try {

        const savedData = localStorage.getItem(
            STORAGE_KEY
        );

        if (savedData !== null) {

            const data = JSON.parse(savedData);

            if (
                Array.isArray(data.applicants) &&
                Number.isInteger(data.nextApplicantId)
            ) {
                return data;
            }
        }

    } catch (error) {

        console.error(
            "Lỗi đọc dữ liệu:", error
        );
    }

    // Tạo dữ liệu nếu chưa có dữ liệu đã lưu

    return {
        applicants: generateApplicants(100),
        nextApplicantId: 101
    };
}

const initialData = loadData();

let applicants = initialData.applicants;

let editingId = null;

let nextApplicantId = initialData.nextApplicantId;


// HÀM LƯU DỮ LIỆU

function saveData() {

    const data = {
        applicants: applicants,
        nextApplicantId: nextApplicantId
    };

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

        console.log("Đã lưu dữ liệu thành công.");

    } catch (error) {

        console.error("Lỗi lưu dữ liệu:", error);

        alert(
            "Không thể lưu dữ liệu vào trình duyệt."
        );
    }
}



// ====================================
// 3. MÀU SẮC TRẠNG THÁI
// ====================================

function getStatusClass(status) {

    const statusClasses = {
        "Chờ xét duyệt": "status-pending",
        "Qua vòng đơn": "status-passed",
        "Phỏng vấn": "status-interview",
        "Trúng tuyển": "status-accepted",
        "Không đạt": "status-rejected"
    };

    return statusClasses[status] || "";
}


// ====================================
// 4. HIỂN THỊ DANH SÁCH ỨNG VIÊN
// ====================================

function renderApplicants(data = applicants) {

    const table = document.getElementById("applicantTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    Không có dữ liệu ứng viên
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(function(applicant) {

        const row = document.createElement("tr");

        const values = [
            applicant.id,
            applicant.name,
            applicant.department,
            applicant.score
        ];

        values.forEach(function(value) {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);
        });

        // Hiển thị trạng thái

        const statusCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className =
            "status " + getStatusClass(applicant.status);

        badge.textContent = applicant.status;

        statusCell.appendChild(badge);

        row.appendChild(statusCell);

        // Tạo nút chỉnh sửa

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Sửa";

        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {
            editApplicant(applicant.id);
        });

        // Tạo nút xóa

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Xóa";

        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteApplicant(applicant.id);
        });

        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        table.appendChild(row);
    });
}


// ====================================
// 5. CẬP NHẬT DASHBOARD
// ====================================

function updateDashboard() {

    document.getElementById("total").textContent =
        applicants.length;

    document.getElementById("pending").textContent =
        applicants.filter(
            a => a.status === "Chờ xét duyệt"
        ).length;

    document.getElementById("interview").textContent =
        applicants.filter(
            a => a.status === "Phỏng vấn"
        ).length;

    document.getElementById("accepted").textContent =
        applicants.filter(
            a => a.status === "Trúng tuyển"
        ).length;
}


// ====================================
// 6. MỞ VÀ ĐÓNG BIỂU MẪU
// ====================================

const modal = document.getElementById("applicantModal");

const form = document.getElementById("applicantForm");

function openModal() {
    modal.classList.add("active");
    document.getElementById("applicantName").focus();
}

function closeModal() {

    modal.classList.remove("active");

    form.reset();

    editingId = null;
}


// ====================================
// 7. THÊM ỨNG VIÊN
// ====================================

function addApplicant() {

    editingId = null;

    form.reset();

    document.getElementById("modalTitle").textContent =
        "Thêm ứng viên mới";

    openModal();
}


// ====================================
// 8. CHỈNH SỬA ỨNG VIÊN
// ====================================

function editApplicant(id) {

    const applicant = applicants.find(
        a => a.id === id
    );

    if (!applicant) return;

    editingId = id;

    document.getElementById("modalTitle").textContent =
        "Chỉnh sửa hồ sơ";

    document.getElementById("applicantName").value =
        applicant.name;

    document.getElementById("applicantDepartment").value =
        applicant.department;

    document.getElementById("applicantScore").value =
        applicant.score;

    document.getElementById("applicantStatus").value =
        applicant.status;

    openModal();
}


// ====================================
// 9. XÓA ỨNG VIÊN
// ====================================

function deleteApplicant(id) {

    const confirmed = confirm(
        "Bạn có chắc chắn muốn xóa hồ sơ này không?"
    );

    if (!confirmed) return;

    applicants = applicants.filter(
        a => a.id !== id
    );
saveData();
    filterApplicants();

    updateDashboard();
    refreshAnalytics();
}


// ====================================
// 10. LƯU HỒ SƠ
// ====================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document
        .getElementById("applicantName")
        .value.trim();

    const department = document
        .getElementById("applicantDepartment")
        .value;

    const scoreInput = document
        .getElementById("applicantScore");

    const score = Number(scoreInput.value);

    const status = document
        .getElementById("applicantStatus")
        .value;

    // Kiểm tra dữ liệu nhập

    if (!name) {

        alert("Vui lòng nhập tên ứng viên!");

        return;
    }

    if (
        scoreInput.value === "" ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > 100
    ) {

        alert("Điểm phải nằm trong khoảng từ 0 đến 100!");

        return;
    }

    // Nếu đang chỉnh sửa hồ sơ

    if (editingId !== null) {

        const applicant = applicants.find(
            a => a.id === editingId
        );

        if (applicant) {

            applicant.name = name;

            applicant.department = department;

            applicant.score = score;

            applicant.status = status;
        }

    } else {

        // Nếu đang thêm hồ sơ mới

        const newApplicant = {

            id: "UV" + String(nextApplicantId).padStart(3, "0"),

            name: name,

            department: department,

            score: score,

            status: status
        };

        applicants.push(newApplicant);

        nextApplicantId++;
    }

    closeModal();
saveData();
    filterApplicants();

    updateDashboard();
    refreshAnalytics();
});


// ====================================
// 11. GẮN SỰ KIỆN CHO CÁC NÚT
// ====================================

document.getElementById("addButton")
    .addEventListener("click", addApplicant);

document.getElementById("cancelButton")
    .addEventListener("click", closeModal);

modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeModal();
    }
});


// ====================================
// 12. KHỞI CHẠY WEBSITE
// ====================================

renderApplicants();

updateDashboard();

console.log("Smart Recruitment Tracker is running.");

// ====================================
// 13. CHUẨN HÓA VĂN BẢN TÌM KIẾM
// ====================================

function normalizeText(text) {

    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .trim();
}


// ====================================
// 14. LẤY CÁC THÀNH PHẦN BỘ LỌC
// ====================================

const searchInput = document.getElementById(
    "searchInput"
);

const departmentFilter = document.getElementById(
    "departmentFilter"
);

const statusFilter = document.getElementById(
    "statusFilter"
);

const resetButton = document.getElementById(
    "resetButton"
);

const resultCount = document.getElementById(
    "resultCount"
);


// ====================================
// 15. TÌM KIẾM VÀ LỌC ỨNG VIÊN
// ====================================


// ====================================
// TÌM KIẾM, SẮP XẾP VÀ PHÂN TRANG
// ====================================

let currentPage = 1;

const sortFilter = document.getElementById("sortFilter");

const pageSize = document.getElementById("pageSize");

const prevPage = document.getElementById("prevPage");

const nextPage = document.getElementById("nextPage");

const pageInfo = document.getElementById("pageInfo");


// Hàm lấy dữ liệu đã lọc và sắp xếp

function getSortedApplicants() {

    const filtered = getExportData();

    const sortType = sortFilter.value;

    if (sortType === "score-desc") {

        filtered.sort(
            (a, b) => b.score - a.score
        );

    } else if (sortType === "score-asc") {

        filtered.sort(
            (a, b) => a.score - b.score
        );

    } else if (sortType === "name-asc") {

        filtered.sort(
            (a, b) => a.name.localeCompare(b.name, "vi")
        );
    }

    return filtered;
}


// Hiển thị dữ liệu theo từng trang

function filterApplicants() {

    const filtered = getSortedApplicants();

    const limit = Number(pageSize.value);

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / limit)
    );

    currentPage = Math.max(
        1,
        Math.min(currentPage, totalPages)
    );

    const start = (currentPage - 1) * limit;

    const end = start + limit;

    const pageData = filtered.slice(start, end);

    renderApplicants(pageData);

    if (filtered.length === 0) {

        resultCount.textContent =
            "Không tìm thấy ứng viên";

    } else {

        resultCount.textContent =
            `Hiển thị ${start + 1}–${Math.min(end, filtered.length)}
            trong ${filtered.length} kết quả
            (Tổng: ${applicants.length} ứng viên)`;
    }

    pageInfo.textContent =
        `Trang ${currentPage}/${totalPages}`;

    prevPage.disabled = currentPage <= 1;

    nextPage.disabled = currentPage >= totalPages;
}



// ====================================
// 16. ĐẶT LẠI BỘ LỌC
// ====================================


function resetFilters() {

    searchInput.value = "";

    departmentFilter.value = "";

    statusFilter.value = "";

    sortFilter.value = "default";

    currentPage = 1;

    filterApplicants();
}

// ====================================
// 17. GẮN SỰ KIỆN TÌM KIẾM
// ====================================

searchInput.addEventListener(
    "input",
    filterApplicants
);

departmentFilter.addEventListener(
    "change",
    filterApplicants
);

statusFilter.addEventListener(
    "change",
    filterApplicants
);

resetButton.addEventListener(
    "click",
    resetFilters
);


// ====================================
// 18. KHỞI TẠO BỘ LỌC
// ====================================

filterApplicants();

console.log("Search and Filter is ready.");

// ====================================
// 19. KHAI BÁO BIỂU ĐỒ
// ====================================

let departmentChartInstance = null;

let statusChartInstance = null;


// ====================================
// 20. TÍNH TOÁN CHỈ SỐ THỐNG KÊ
// ====================================

function updateAnalytics() {

    const total = applicants.length;

    const accepted = applicants.filter(
        a => a.status === "Trúng tuyển"
    ).length;

    const totalScore = applicants.reduce(
        (sum, a) => sum + a.score,
        0
    );

    const acceptanceRate = total > 0
        ? (accepted / total * 100).toFixed(1)
        : "0.0";

    const averageScore = total > 0
        ? (totalScore / total).toFixed(1)
        : "0.0";

    document.getElementById("acceptanceRate")
        .textContent = acceptanceRate + "%";

    document.getElementById("averageScore")
        .textContent = averageScore;
}


// ====================================
// 21. BIỂU ĐỒ ỨNG VIÊN THEO BAN
// ====================================

function renderDepartmentChart() {

    const departmentCounts = departments.map(
        department => applicants.filter(
            a => a.department === department
        ).length
    );

    const canvas = document.getElementById(
        "departmentChart"
    );

    if (departmentChartInstance) {

        departmentChartInstance.data.datasets[0].data =
            departmentCounts;

        departmentChartInstance.update();

        return;
    }

    departmentChartInstance = new Chart(canvas, {

        type: "bar",

        data: {

            labels: departments,

            datasets: [{

                label: "Số lượng ứng viên",

                data: departmentCounts,

                backgroundColor: [
                    "#2563eb",
                    "#3b82f6",
                    "#60a5fa",
                    "#818cf8",
                    "#a5b4fc"
                ],

                borderRadius: 8,

                borderSkipped: false
            }]
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

                y: {

                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    }
                },

                x: {

                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}


// ====================================
// 22. BIỂU ĐỒ TRẠNG THÁI TUYỂN DỤNG
// ====================================

function renderStatusChart() {

    const statusCounts = statuses.map(
        status => applicants.filter(
            a => a.status === status
        ).length
    );

    const canvas = document.getElementById(
        "statusChart"
    );

    if (statusChartInstance) {

        statusChartInstance.data.datasets[0].data =
            statusCounts;

        statusChartInstance.update();

        return;
    }

    statusChartInstance = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: statuses,

            datasets: [{

                data: statusCounts,

                backgroundColor: [
                    "#f59e0b",
                    "#3b82f6",
                    "#8b5cf6",
                    "#10b981",
                    "#ef4444"
                ],

                borderWidth: 3,

                borderColor: "#ffffff",

                hoverOffset: 8
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        padding: 15,

                        usePointStyle: true
                    }
                }
            }
        }
    });
}


// ====================================
// 23. PHỄU TUYỂN DỤNG MINH HỌA
// ====================================

function renderRecruitmentFunnel() {

    const total = applicants.length;

    const passed = applicants.filter(
        a => [
            "Qua vòng đơn",
            "Phỏng vấn",
            "Trúng tuyển"
        ].includes(a.status)
    ).length;

    const interviewed = applicants.filter(
        a => [
            "Phỏng vấn",
            "Trúng tuyển"
        ].includes(a.status)
    ).length;

    const accepted = applicants.filter(
        a => a.status === "Trúng tuyển"
    ).length;

    const stages = [

        {
            label: "Tổng hồ sơ",
            count: total,
            color: "#1d4ed8"
        },

        {
            label: "Qua vòng đơn trở lên",
            count: passed,
            color: "#3b82f6"
        },

        {
            label: "Phỏng vấn trở lên",
            count: interviewed,
            color: "#7c3aed"
        },

        {
            label: "Trúng tuyển",
            count: accepted,
            color: "#059669"
        }
    ];

    const funnel = document.getElementById(
        "recruitmentFunnel"
    );

    funnel.innerHTML = "";

    stages.forEach(stage => {

        const percent = total > 0
            ? stage.count / total * 100
            : 0;

        funnel.innerHTML += `

            <div class="funnel-stage">

                <div class="funnel-label">

                    <span>${stage.label}</span>

                    <span>
                        ${stage.count} ứng viên
                        (${percent.toFixed(1)}%)
                    </span>

                </div>

                <div class="funnel-track">

                    <div
                        class="funnel-bar"
                        style="
                            width: ${percent}%;
                            background: ${stage.color};
                        "
                    ></div>

                </div>

            </div>
        `;
    });
}


// ====================================
// 24. CẬP NHẬT TOÀN BỘ ANALYTICS
// ====================================

function refreshAnalytics() {

    updateAnalytics();

    renderRecruitmentFunnel();

    if (typeof Chart !== "undefined") {

        renderDepartmentChart();

        renderStatusChart();

    } else {

        console.warn(
            "Không tải được thư viện Chart.js."
        );
    }
}


// ====================================
// 25. KHỞI TẠO ANALYTICS
// ====================================

refreshAnalytics();

console.log("Recruitment Analytics is ready.");
saveData();

// ====================================
// 26. LẤY DANH SÁCH ỨNG VIÊN ĐANG LỌC
// ====================================

function getExportData() {

    const keyword = normalizeText(
        searchInput.value
    );

    const selectedDepartment =
        departmentFilter.value;

    const selectedStatus =
        statusFilter.value;

    return applicants.filter(applicant => {

        const matchesSearch =
            normalizeText(applicant.name)
                .includes(keyword) ||
            normalizeText(applicant.id)
                .includes(keyword);

        const matchesDepartment =
            selectedDepartment === "" ||
            applicant.department === selectedDepartment;

        const matchesStatus =
            selectedStatus === "" ||
            applicant.status === selectedStatus;

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
        );
    });
}


// ====================================
// 27. CHUẨN HÓA DỮ LIỆU CSV
// ====================================

function escapeCSV(value) {

    let text = String(value ?? "");

    // Ngăn Excel hiểu văn bản thành công thức

    if (/^\s*[=+\-@]|^[\t\r\n]/.test(text)) {
        text = "'" + text;
    }

    return '"' + text.replace(/"/g, '""') + '"';
}


// ====================================
// 28. XUẤT FILE CSV
// ====================================

function exportCSV() {

    const exportData = getExportData();

    if (exportData.length === 0) {

        alert("Không có dữ liệu để xuất!");

        return;
    }

    const headers = [
        "Mã ứng viên",
        "Họ và tên",
        "Ban ứng tuyển",
        "Điểm vòng đơn",
        "Trạng thái"
    ];

    const rows = exportData.map(applicant => [

        applicant.id,
        applicant.name,
        applicant.department,
        applicant.score,
        applicant.status

    ]);

    const csvContent = [headers, ...rows]

        .map(row =>
            row.map(escapeCSV).join(",")
        )

        .join("\r\n");

    // UTF-8 BOM giúp Excel đọc tiếng Việt

    const blob = new Blob(

        ["\uFEFF", csvContent],

        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const date = new Date();

    const dateString =
        date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");

    link.href = url;

    link.download =
        "Smart_Recruitment_Tracker_" +
        dateString +
        ".csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);

    console.log(
        "Đã xuất " +
        exportData.length +
        " hồ sơ."
    );
}


// ====================================
// 29. GẮN SỰ KIỆN XUẤT CSV
// ====================================

document.getElementById("exportButton")

    .addEventListener("click", exportCSV);

console.log("CSV Export is ready.");
