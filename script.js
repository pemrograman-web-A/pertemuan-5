document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");
  const namaInput = document.getElementById("nama");
  const nrpInput = document.getElementById("nrp");
  const matkulSelect = document.getElementById("matkul");
  const dosenSelect = document.getElementById("dosen");
  const provinsiSelect = document.getElementById("provinsi");
  const kotaSelect = document.getElementById("kota");
  const fakultasSelect = document.getElementById("fakultas");
  const departemenInput = document.getElementById("departemen");

  const kecamatanSelect = document.getElementById("kecamatan");
  const desaSelect = document.getElementById("desa");

  const kodeposInput = document.getElementById("kodepos");
  const searchButton = document.getElementById("search-button");
  const daftarButton = document.getElementById("daftar-button");
  const searchResultContainer = document.getElementById(
    "search-result-container"
  );
  const searchResultDiv = document.getElementById("search-result");

  const kotaAreaCache = {};
  const mataKuliahDosenData = {
    "Dasar Pemrograman": [
      "Dr. Eng. Ratna Widjaya, S.Kom., M.Sc.",
      "Dr. Andi Nugroho, S.Kom., M.Kom.",
      "Prof. Bambang Hartono, S.Kom., M.Sc., Ph.D.",
      "Putri Maharani, S.Kom., M.Kom., Ph.D.",
      "Agus Prasetyo, S.Kom., M.Kom.",
    ],

    "Jaringan Komputer": [
      "Dr. Budi Santoso, S.Kom., M.Kom.",
      "Dr. Gita Rahayu, S.Kom., M.Sc.",
      "Prof. Suryo Laksono, S.Kom., M.Sc., Ph.D.",
      "Citra Dewi, S.Kom., M.Kom.",
      "Hendra Saputra, S.Kom., M.Sc.",
    ],

    "Sistem Basis Data": [
      "Dr. Lestari Handayani, S.Kom., M.Kom.",
      "Arif Wibowo, S.Kom., M.Sc., Ph.D.",
      "Dr. Nanda Kusuma, S.Kom., M.Kom.",
      "Prof. Raden Surya Putra, S.Kom., M.Sc., Ph.D.",
      "Maya Sari, S.Kom., M.Kom.",
    ],

    "Sistem Digital": [
      "Dr. Candra Prasetya, S.Kom., M.Kom.",
      "Prof. Dwi Kurniawan, S.Kom., M.Sc., Ph.D.",
      "Sri Utami, S.Kom., M.Sc.",
      "Dr. Eng. Rizky Firmansyah, S.Kom., M.Kom.",
      "Dian Puspitasari, S.Kom., M.Kom., Ph.D.",
    ],

    "Sistem Operasi": [
      "Bayu Adi Nugraha, S.Kom., M.Sc., Ph.D.",
      "Dr. Laras Widodo, S.Kom., M.Kom.",
      "Prof. Retno Anggraini, S.Kom., M.Sc., Ph.D.",
      "Rudi Hartawan, S.Kom., M.Kom.",
      "Novi Lestari, S.Kom., M.Sc.",
    ],

    "Struktur Data": [
      "Dr. Eka Saputri, S.Kom., M.Kom.",
      "Prof. Ahmad Faisal, S.Kom., M.Sc., Ph.D.",
      "Bambang Wijaya, S.Kom., M.Sc.",
      "Dr. Ratih Permata, S.Kom., M.Kom.",
      "Siti Nurhaliza, S.Kom., M.Kom., Ph.D.",
    ],

    "Kecerdasan Buatan": [
      "Dr. Surya Dharmawan, S.Kom., M.Kom.",
      "Prof. Dewi Kartika, S.Kom., M.Sc., Ph.D.",
      "Rangga Aditya, S.Kom., M.Sc.",
      "Dr. Fajar Hidayat, S.Kom., M.Kom.",
      "Putri Melati, S.Kom., M.Kom.",
    ],

    "Rekayasa Perangkat Lunak": [
      "Dr. Intan Prameswari, S.Kom., M.Kom.",
      "Prof. Adi Susilo, S.Kom., M.Sc., Ph.D.",
      "Rizky Ardiansyah, S.Kom., M.Sc.",
      "Dr. Eng. Wulan Pertiwi, S.Kom., M.Kom.",
      "Nur Aisyah, S.Kom., M.Kom., Ph.D.",
    ],
  };

  const suggestionsList = document.getElementById("suggestions");
  const allNames = ["Mitra Partogi"];

  const updateSuggestions = () => {
    const fullText = namaInput.value.trim();
    const words = fullText.split(" ");
    const lastWord = words[words.length - 1].toLowerCase();

    suggestionsList.innerHTML = "";
    suggestionsList.classList.add("hidden");

    if (lastWord.length === 0) {
      return;
    }

    const filteredNames = allNames.filter((name) =>
      name.toLowerCase().startsWith(lastWord)
    );

    if (filteredNames.length > 0) {
      filteredNames.slice(0, 10).forEach((name) => {
        const li = document.createElement("li");
        li.textContent = name;
        li.addEventListener("click", () => {
          words[words.length - 1] = name;
          namaInput.value = words.join(" ") + " ";
          suggestionsList.classList.add("hidden");
          namaInput.focus();
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.classList.remove("hidden");
    }
  };

  namaInput.addEventListener("input", updateSuggestions);

  document.addEventListener("click", (event) => {
    if (
      !namaInput.contains(event.target) &&
      !suggestionsList.contains(event.target)
    ) {
      suggestionsList.classList.add("hidden");
    }
  });

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
  const populateMataKuliah = () => {
    for (const matkul in mataKuliahDosenData) {
      const option = document.createElement("option");
      option.value = matkul;
      option.textContent = matkul;
      matkulSelect.appendChild(option);
    }
  };

  const populateFakultas = () => {
    const fakultasList = ["FTEIC", "FTK", "FTSPK", "FDKBD", "FTIRS"];
    fakultasList.forEach((fk) => {
      const opt = document.createElement("option");
      opt.value = fk;
      opt.textContent = fk;
      fakultasSelect.appendChild(opt);
    });
  };

  const populateDosen = (matkul) => {
    dosenSelect.innerHTML = '<option value="">-- Pilih Dosen --</option>';
    dosenSelect.disabled = true;
    if (matkul) {
      const dosenList = mataKuliahDosenData[matkul].sort();
      if (dosenList) {
        dosenSelect.disabled = false;
        dosenList.forEach((dosen) => {
          const option = document.createElement("option");
          option.value = dosen;
          option.textContent = dosen;
          dosenSelect.appendChild(option);
        });
      }
    }
  };
  matkulSelect.addEventListener("change", (e) => {
    const selectedMatkul = e.target.value;
    populateDosen(selectedMatkul);
  });
  const populateProvinsi = async () => {
    const provinces = await fetchData(
      "https://kodepos-2d475.firebaseio.com/list_propinsi.json"
    );
    if (provinces) {
      for (const key in provinces) {
        if (provinces.hasOwnProperty(key)) {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = provinces[key];
          provinsiSelect.appendChild(option);
        }
      }
    }
  };
  const populateKota = async (provinsiId) => {
    kotaSelect.innerHTML =
      '<option value="">-- Pilih Kota/Kabupaten --</option>';
    kotaSelect.disabled = true;

    // reset bawahnya
    kecamatanSelect.innerHTML =
      '<option value="">-- Pilih Kecamatan --</option>';
    kecamatanSelect.disabled = true;
    desaSelect.innerHTML =
      '<option value="">-- Pilih Kelurahan/Desa --</option>';
    desaSelect.disabled = true;
    kodeposInput.value = "";
    daftarButton.disabled = true;
    searchResultContainer.classList.add("hidden");
    searchResultContainer.classList.remove("error");

    if (!provinsiId) return;

    const cities = await fetchData(
      `https://kodepos-2d475.firebaseio.com/list_kotakab/${provinsiId}.json`
    );
    if (cities) {
      kotaSelect.disabled = false;
      for (const key in cities) {
        if (cities.hasOwnProperty(key)) {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = cities[key];
          kotaSelect.appendChild(option);
        }
      }
    }
  };

  const fetchKotaAreas = async (kotaId) => {
    if (kotaAreaCache[kotaId]) return kotaAreaCache[kotaId];
    const data = await fetchData(
      `https://kodepos-2d475.firebaseio.com/kota_kab/${kotaId}.json`
    );
    if (Array.isArray(data)) {
      kotaAreaCache[kotaId] = data;
      return data;
    }
    return null;
  };

  const populateKecamatan = async (kotaId) => {
    kecamatanSelect.innerHTML =
      '<option value="">-- Pilih Kecamatan --</option>';
    kecamatanSelect.disabled = true;
    desaSelect.innerHTML =
      '<option value="">-- Pilih Kelurahan/Desa --</option>';
    desaSelect.disabled = true;
    kodeposInput.value = "";
    daftarButton.disabled = true;
    searchResultContainer.classList.add("hidden");
    searchResultContainer.classList.remove("error");

    if (!kotaId) return;
    const areas = await fetchKotaAreas(kotaId);
    if (!areas) return;

    const kecSet = new Set(areas.map((a) => a.kecamatan).filter(Boolean));
    [...kecSet].sort().forEach((kec) => {
      const opt = document.createElement("option");
      opt.value = kec;
      opt.textContent = kec;
      kecamatanSelect.appendChild(opt);
    });
    kecamatanSelect.disabled = false;
  };

  const populateDesa = (kotaId, kecamatanName) => {
    desaSelect.innerHTML =
      '<option value="">-- Pilih Kelurahan/Desa --</option>';
    desaSelect.disabled = true;
    kodeposInput.value = "";
    daftarButton.disabled = true;
    searchResultContainer.classList.add("hidden");
    searchResultContainer.classList.remove("error");

    const areas = kotaAreaCache[kotaId];
    if (!areas || !kecamatanName) return;

    const desaSet = new Set(
      areas
        .filter((a) => a.kecamatan === kecamatanName)
        .map((a) => a.kelurahan)
        .filter(Boolean)
    );
    [...desaSet].sort().forEach((desa) => {
      const opt = document.createElement("option");
      opt.value = desa;
      opt.textContent = desa;
      desaSelect.appendChild(opt);
    });
    desaSelect.disabled = false;
  };

  const updateKodePos = (kotaId, kecamatanName, desaName) => {
    searchResultContainer.classList.add("hidden");
    searchResultContainer.classList.remove("error");
    daftarButton.disabled = true;
    kodeposInput.value = "";

    const areas = kotaAreaCache[kotaId];
    if (!areas || !kecamatanName || !desaName) return;

    const matches = areas.filter(
      (a) => a.kecamatan === kecamatanName && a.kelurahan === desaName
    );
    if (matches.length > 0) {
      const uniqueCodes = [
        ...new Set(matches.map((m) => m.kodepos).filter(Boolean)),
      ];
      if (uniqueCodes.length > 0) {
        const kode = uniqueCodes[0];
        kodeposInput.value = kode;
        searchResultDiv.innerHTML = `<h4>Kode Pos</h4><p><strong>${kode}</strong> untuk Kelurahan ${desaName}, Kecamatan ${kecamatanName}, ${
          kotaSelect.options[kotaSelect.selectedIndex]?.text
        }.</p>`;
        searchResultContainer.classList.remove("hidden");
        daftarButton.disabled = false;
        return;
      }
    }
    searchResultDiv.innerHTML = `<h4>Kode Pos Tidak Ditemukan</h4><p>Data untuk ${desaName}, ${kecamatanName} tidak tersedia.</p>`;
    searchResultContainer.classList.remove("hidden");
    searchResultContainer.classList.add("error");
  };

  provinsiSelect.addEventListener("change", (e) => {
    const selectedProvinsiId = e.target.value;
    populateKota(selectedProvinsiId);
  });

  kotaSelect.addEventListener("change", async (e) => {
    const selectedKotaId = e.target.value;
    await populateKecamatan(selectedKotaId);
  });

  kecamatanSelect.addEventListener("change", (e) => {
    const selectedKotaId = kotaSelect.value;
    const selectedKecamatan = e.target.value;
    populateDesa(selectedKotaId, selectedKecamatan);
  });

  desaSelect.addEventListener("change", (e) => {
    const selectedKotaId = kotaSelect.value;
    const selectedKecamatan = kecamatanSelect.value;
    const selectedDesa = e.target.value;
    updateKodePos(selectedKotaId, selectedKecamatan, selectedDesa);
  });

  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!registrationForm.reportValidity()) return;

    if (!daftarButton.disabled) {
      window.location.href = "registrationsucceed.html";
    } else {
      alert(
        "Mohon pilih Provinsi, Kota/Kabupaten, Kecamatan, dan Kelurahan/Desa terlebih dahulu."
      );
    }
  });

  populateMataKuliah();
  populateFakultas();
  populateProvinsi();
});
