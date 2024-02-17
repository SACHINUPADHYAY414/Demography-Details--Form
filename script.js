    document.addEventListener('DOMContentLoaded', function() {
    // Fetching elements from the DOM
    const form = document.getElementById('patientForm');
    const titleSelect = document.getElementById('titleSelect');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const address1Input = document.getElementById('address1');
    const address2Input = document.getElementById('address2');
    const mobileInput = document.getElementById('mobile');
    const addBtn = document.getElementById('addBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const databaseContent = document.getElementById('databaseContent');

    // Retrieving patients data from local storage or initializing an empty object if it doesn't exist
    let patients = JSON.parse(localStorage.getItem('patients')) || {};

    // Function to generate a unique health ID for a new patient
    function generateUHID() {
        let maxId = 0;
        for (const id in patients) {
            const numPart = parseInt(id.substring(4));
            if (!isNaN(numPart) && numPart > maxId) {
                maxId = numPart;
            }
        }
        return `RGCI${(maxId + 1).toString().padStart(4, '0')}`;
    }

    // Function to update local storage with the latest patient data
    function updateLocalStorage() {
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    // Function to add a new patient
    function addPatient() {
        // Fetching input values
        const title = titleSelect.value;
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const address1 = address1Input.value.trim();
        const address2 = address2Input.value.trim();
        const mobile = mobileInput.value.trim();

        // Validation: Check if required fields are empty
        if (!firstName || !lastName || !address1 || !address2 || !mobile) {
            alert("Please fill in all required fields.");
            return;
        }

        // Adding default values if some fields are empty
        if (!firstName) {
            firstName = ' ';
        }
        if (!lastName) {
            lastName = ' ';
        }
        if (!address1) {
            address1 = ' ';
        }

        // Generating a new UHID for the patient
        const uhid = generateUHID();

        // Creating a new patient object and adding it to the patients list
        patients[uhid] = {
            title: title,
            firstName: firstName,
            lastName: lastName,
            address1: address1,
            address2: address2,
            mobile: mobile
        };

        // Updating local storage and clearing the form
        updateLocalStorage();
        clearForm();
        displayPatients();
    }

    // Function to modify existing patient data
    function modifyPatient(patientId, newData) {
        if (!patients.hasOwnProperty(patientId)) {
            console.log("Patient ID does not exist.");
            return;
        }

        // Updating patient data with new data
        Object.assign(patients[patientId], newData);

        // Updating local storage with the modified patients object
        updateLocalStorage();

        console.log("Patient details modified successfully.");
        // Refresh the displayed patient list
        displayPatients();
    }

    // Function to display all patients in the database
    function displayPatients() {
        databaseContent.innerHTML = '';
        for (const uhid in patients) {
            const patient = patients[uhid];
            const listItem = document.createElement('div');
            // Creating HTML content for each patient and appending it to the databaseContent element
            listItem.innerHTML = `<b>UHID:</b> ${uhid}, 
            <b>Name:</b>${patient.title} ${patient.firstName} ${patient.lastName}, 
            <b>Address:</b> ${patient.address1}, ${patient.address2},
            <b>Mobile:</b> ${patient.mobile}`;
            databaseContent.appendChild(listItem);
        }
    }

    // Function to clear the patient input form
    function clearForm() {
        titleSelect.value = 'Mr'; // Set default value for title
        firstNameInput.value = '';
        lastNameInput.value = '';
        address1Input.value = '';
        address2Input.value = '';
        mobileInput.value = '';
    }

    // Event listener for the "Add Patient" button
    addBtn.addEventListener('click', addPatient);

    // Event listener for the "Update Patient" button
    updateBtn.addEventListener('click', function() {
        const patientId = prompt("Enter Patient ID to update:");
        if (patientId) {
            // Fetch new data from the form fields
            const newData = {
                title: titleSelect.value,
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                address1: address1Input.value,
                address2: address2Input.value,
                mobile: mobileInput.value
            };
            modifyPatient(patientId, newData);
        }
    });

    // Event listener for the "Show Database" button
    const showDatabaseBtn = document.getElementById('showDatabaseBtn');
    showDatabaseBtn.addEventListener('click', function() {
        displayPatients();
    });

    // Function to delete one or more patients
    function deletePatient(patientIds) {
        patientIds.forEach(patientId => {
            if (patients.hasOwnProperty(patientId)) {
                delete patients[patientId];
            }
        });

        // Update local storage with the modified patients object
        updateLocalStorage();

        console.log("Patients deleted successfully.");
        // Refresh the displayed patient list
        displayPatients();
    }

    // Event listener for the "Delete Patient" button
    deleteBtn.addEventListener('click', function() {
        const patientIdsString = prompt("Enter Patient IDs to delete (if you delete multiple Patient IDs, separate them by comma):");
        if (patientIdsString) {
            const patientIds = patientIdsString.split(',').map(id => id.trim());
            deletePatient(patientIds);
        }
    });

});
