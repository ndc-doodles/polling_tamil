// TOGGLE

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



// filter.js
document.addEventListener('DOMContentLoaded', () => {
  const districtFilter = document.getElementById('filter-district');
  const constituencyFilter = document.getElementById('filter-constituency');
  const tableRows = document.querySelectorAll('.candidate-row');

  function filterTable() {
    const districtValue = districtFilter.value;
    const constituencyValue = constituencyFilter.value;

    tableRows.forEach(row => {
      const rowDistrict = row.dataset.district;
      const rowConstituency = row.dataset.constituency;

      const matchDistrict = !districtValue || rowDistrict === districtValue;
      const matchConstituency = !constituencyValue || rowConstituency === constituencyValue;

      if (matchDistrict && matchConstituency) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  districtFilter.addEventListener('change', filterTable);
  constituencyFilter.addEventListener('change', filterTable);
});

// CANDIDATE
document.addEventListener('DOMContentLoaded', () => {
  let candidates = [];
  let editIndex = null;

  const form = document.getElementById('candidate-form');
  const submitBtn = document.getElementById('submit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const tableBody = document.getElementById('candidate-table-body');

  function renderTable() {
    tableBody.innerHTML = '';
    candidates.forEach((cand, index) => {
      const row = document.createElement('tr');
      row.classList.add('text-gray-700');
      row.innerHTML = `
        <td class="px-3 py-2"><img src="${cand.img}" class="w-10 h-10 rounded-full object-cover"></td>
        <td class="px-3 py-2">${cand.name}</td>
        <td class="px-3 py-2">${cand.district}</td>
        <td class="px-3 py-2">${cand.constituency}</td>
        <td class="px-3 py-2">${cand.party}</td>
        <td class="px-3 py-2"><img src="${cand.partySymbol}" class="w-6 h-6 object-cover"></td>
        <td class="px-3 py-2 space-x-2">
          <button type="button" onclick="editCandidate(${index})" class="text-blue-600 hover:underline">Edit</button>
          <button type="button" onclick="deleteCandidate(${index})" class="text-red-600 hover:underline">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function resetForm() {
    form.reset();
    editIndex = null;
    submitBtn.textContent = 'Add Candidate';
    cancelEditBtn.classList.add('hidden');
    document.getElementById('form-title').textContent = 'Add Candidate';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('candidate-name').value;
    const district = document.getElementById('candidate-district').value;
    const constituency = document.getElementById('candidate-constituency').value;
    const party = document.getElementById('candidate-party').value;

    const imgFile = document.getElementById('candidate-img').files[0];
    const partyFile = document.getElementById('party-symbol').files[0];
    const img = imgFile ? URL.createObjectURL(imgFile) : 'placeholder.jpg';
    const partySymbol = partyFile ? URL.createObjectURL(partyFile) : 'placeholder.png';

    const candidateData = { name, district, constituency, party, img, partySymbol };

    if (editIndex !== null) {
      candidates[editIndex] = candidateData;
    } else {
      candidates.push(candidateData);
    }

    renderTable();
    resetForm();
  });

  cancelEditBtn.addEventListener('click', resetForm);

  window.editCandidate = function (index) {
    const cand = candidates[index];
    document.getElementById('candidate-name').value = cand.name;
    document.getElementById('candidate-district').value = cand.district;
    document.getElementById('candidate-constituency').value = cand.constituency;
    document.getElementById('candidate-party').value = cand.party;
    submitBtn.textContent = 'Update Candidate';
    cancelEditBtn.classList.remove('hidden');
    document.getElementById('form-title').textContent = 'Edit Candidate';
    editIndex = index;
  }

  window.deleteCandidate = function (index) {
    if (confirm('Are you sure you want to delete this candidate?')) {
      candidates.splice(index, 1);
      renderTable();
      resetForm();
    }
  }
});


// OPINION FORM

document.addEventListener('DOMContentLoaded', () => {
  const selectAll = document.getElementById('select-all');
  const deleteSelectedBtn = document.getElementById('delete-selected');
  const tableBody = document.querySelector('tbody'); // adjust to your table

  if (selectAll) {
    selectAll.addEventListener('change', () => {
      const rowCheckboxes = document.querySelectorAll('.row-checkbox');
      rowCheckboxes.forEach(cb => cb.checked = selectAll.checked);
    });
  }

  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener('click', () => {
      document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
        cb.closest('tr').remove();
      });
      if (selectAll) selectAll.checked = false;
    });
  }

  // Event delegation for individual delete buttons
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        e.target.closest('tr').remove();
      }
    });
  }
});





// BLOG

document.addEventListener('DOMContentLoaded', () => {
  let editingRow = null;

  const blogForm = document.getElementById('blog-form');
  const cancelBlogEditBtn = document.getElementById('cancel-edit-btn');
  const blogTableBody = document.getElementById('blog-table-body');

  blogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const heading = document.getElementById('blog-heading').value;
    const category = document.getElementById('blog-category').value;
    const label = document.getElementById('blog-label').value;
    const date = document.getElementById('blog-date').value;
    const paragraph = document.getElementById('blog-paragraph').value;

    const imgInput = document.getElementById('blog-img');
    const imgSrc = imgInput.files[0] ? URL.createObjectURL(imgInput.files[0]) : '';

    if (editingRow) {
      editingRow.querySelector('.td-img img').src = imgSrc || editingRow.querySelector('.td-img img').src;
      editingRow.querySelector('.td-heading').textContent = heading;
      editingRow.querySelector('.td-category').textContent = category;
      editingRow.querySelector('.td-label').textContent = label;
      editingRow.querySelector('.td-date').textContent = date;
      editingRow.querySelector('.td-paragraph').textContent = paragraph;
      resetForm();
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-3 py-2 td-img"><img src="${imgSrc}" alt="Blog Image" class="w-16 h-16 object-cover rounded"></td>
        <td class="px-3 py-2 td-heading">${heading}</td>
        <td class="px-3 py-2 td-category">${category}</td>
        <td class="px-3 py-2 td-label">${label}</td>
        <td class="px-3 py-2 td-date">${date}</td>
        <td class="px-3 py-2 td-paragraph">${paragraph}</td>
        <td class="px-3 py-2">
          <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
        </td>
      `;
      blogTableBody.appendChild(tr);
    }

    blogForm.reset();
  });

  cancelBlogEditBtn.addEventListener('click', resetForm);

  blogTableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (e.target.classList.contains('edit-btn')) {
      editingRow = row;
      document.getElementById('blog-heading').value = row.querySelector('.td-heading').textContent;
      document.getElementById('blog-category').value = row.querySelector('.td-category').textContent;
      document.getElementById('blog-label').value = row.querySelector('.td-label').textContent;
      document.getElementById('blog-date').value = row.querySelector('.td-date').textContent;
      document.getElementById('blog-paragraph').value = row.querySelector('.td-paragraph').textContent;
      cancelBlogEditBtn.classList.remove('hidden');
      document.getElementById('submit-btn').textContent = 'Update Blog';
    } else if (e.target.classList.contains('delete-btn')) {
      row.remove();
      resetForm();
    }
  });

  function resetForm() {
    editingRow = null;
    blogForm.reset();
    cancelBlogEditBtn.classList.add('hidden');
    document.getElementById('submit-btn').textContent = 'Add Blog';
  }
});



// CONTACT

document.addEventListener('DOMContentLoaded', () => {
  const contactTableBody = document.getElementById('contact-table-body');
  const selectAllCheckbox = document.getElementById('select-all');
  const deleteSelectedBtn = document.getElementById('delete-selected');

  // Sample data
  let submissions = [
    { name: 'John Doe', email: 'john@example.com', message: 'Hello admin!' },
    { name: 'Jane Smith', email: 'jane@example.com', message: 'I need help.' },
    { name: 'Alice', email: 'alice@example.com', message: 'Great website!' }
  ];

  function renderTable() {
    contactTableBody.innerHTML = '';
    submissions.forEach((sub) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-3 py-2">
          <input type="checkbox" class="row-checkbox">
        </td>
        <td class="px-3 py-2">${sub.name}</td>
        <td class="px-3 py-2">${sub.email}</td>
        <td class="px-3 py-2">${sub.message}</td>
        <td class="px-3 py-2">
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
        </td>
      `;
      contactTableBody.appendChild(tr);
    });
  }

  // Initial render
  renderTable();

  // Select All functionality
  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = contactTableBody.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
  });

  // Delete selected rows
  deleteSelectedBtn.addEventListener('click', () => {
    const checkboxes = contactTableBody.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => {
      const row = cb.closest('tr');
      const rowIndex = Array.from(contactTableBody.children).indexOf(row);
      submissions.splice(rowIndex, 1);
    });
    selectAllCheckbox.checked = false;
    renderTable();
  });

  // Individual delete button
  contactTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const row = e.target.closest('tr');
      const rowIndex = Array.from(contactTableBody.children).indexOf(row);
      submissions.splice(rowIndex, 1);
      renderTable();
    }
  });
});
