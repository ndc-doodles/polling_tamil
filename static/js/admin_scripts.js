// Sidebar toggle
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('-translate-x-full');
    }

  // District data structure
  let districts = {};

  // Add district
  function addDistrict() {
    const name = document.getElementById("districtInput").value.trim();
    if (!name) return alert("Enter district name");
    if (districts[name]) return alert("District already exists");

    districts[name] = [];
    document.getElementById("districtInput").value = "";
    updateDistricts();
  }

  // Update district list and select dropdown
  function updateDistricts() {
    const districtList = document.getElementById("districtList");
    const districtSelect = document.getElementById("districtSelect");

    districtList.innerHTML = "";
    districtSelect.innerHTML = '<option value="">Select District</option>';

    for (const d in districts) {
      const item = document.createElement("div");
      item.className = "flex justify-between items-center border-b pb-2";

      item.innerHTML = `
        <label class="flex items-center gap-2">
          <input type="radio" name="selectedDistrict" value="${d}" />
          <span class="font-medium">${d}</span>
        </label>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500">(${districts[d].length} constituencies)</span>
          <button onclick="deleteDistrict('${d}')" class="text-red-500 hover:underline text-sm">Delete</button>
        </div>
      `;

      districtList.appendChild(item);

      const option = document.createElement("option");
      option.value = d;
      option.textContent = d;
      districtSelect.appendChild(option);
    }
  }

  // Add constituency
  function addConstituency() {
    const district = document.getElementById("districtSelect").value;
    const name = document.getElementById("constituencyInput").value.trim();
    if (!district) return alert("Select a district");
    if (!name) return alert("Enter constituency name");

    districts[district].push(name);
    document.getElementById("constituencyInput").value = "";
    showConstituencies(district);
    updateDistricts();
  }

  // Show constituencies under selected district
  function showConstituencies(district) {
    const list = document.getElementById("constituencyList");
    list.innerHTML = `<h4 class="font-semibold mb-2 text-[#06038D]">${district}</h4>`;

    districts[district].forEach((c) => {
      list.innerHTML += `
        <div class="border-b py-1 px-2 text-sm">${c}</div>
      `;
    });
  }

  // Delete selected district
  function deleteDistrict(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      delete districts[name];
      updateDistricts();
      document.getElementById("constituencyList").innerHTML = "";
    }
  }

