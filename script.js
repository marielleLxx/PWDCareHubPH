const sidebar =document.querySelector(".sidebar");
const sidebarToggleBtn = document.querySelectorAll(".sidebar-toggle");
const searchForm = document.querySelector(".search-form");

// Toggle sidebar collapsed state on button click
sidebarToggleBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    })

});

// Expand the sidebar when the search form is clicked
searchForm.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
        searchForm.querySelector("input").focus(); 
    }

});