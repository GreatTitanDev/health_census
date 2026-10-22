// intialze variables

const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById('report');
const btnSearch = document.getElementById('btnSearch');
const patients = [];

const healthData = {
    conditions: [
        {
            name: 'Thyroid',
            imagesrc: './images/thyroid.jpeg',
            symptoms: [
                'Fatigue',
                'Weight gain or loss',
                'Dry skin',
                'Muscle weakness',
                'Irregular menstrual periods'
            ],
            prevention: [
                'Eat a balanced diet',
                'Exercise regularly',
                'Get regular check-ups'
            ],
            treatment: 'Medication like levothyroxine may be prescribed by a doctor.'
        },
        {
            name: 'Diabetes',
            imagesrc: './images/diabetes.jpeg',
            symptoms: [
                'Frequent urination',
                'Increased thirst',
                'Blurry vision',
                'Fatigue',
                'Slow healing of cuts or sores'
            ],
            prevention: [
                'Maintain a healthy weight',
                'Follow a balanced diet',
                'Regular exercise'
            ],
            treatment: 'Management includes medication, insulin therapy, and lifestyle changes.'
        },
        {
            name: 'High Blood Pressure',
            imagesrc: './images/blood_pressure.jpeg',
            symptoms: [
                'Headaches',
                'Shortness of breath',
                'Chest pain',
                'Dizziness',
                'Blurred or double vision'
            ],
            prevention: [
                'Reduce salt intake',
                'Exercise regularly',
                'Maintain a healthy weight'
            ],
            treatment: 'Medications like ACE inhibitors or diuretics may be prescribed.'
        }
    ]
};

function addPatient() {
    const name = document.getElementById('name').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age').value;
    const condition = document.getElementById('condition').value;

    if (name && gender && age && condition) {
        patients.push({ name, gender: gender.value, age, condition });
        resetForm();
        generateReport();
    }
}

function resetForm() {
    document.getElementById('name').value = '';
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (selectedGender) {
        selectedGender.checked = false;
    }
    document.getElementById('age').value = '';
    document.getElementById('condition').value = '';
}

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        'High Blood Pressure': 0
    };

    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            'High Blood Pressure': 0
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            'High Blood Pressure': 0
        }
    };

    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += 'Conditions Breakdown:<br>';

    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += '<br>Gender-Based Conditions: <br>';
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}:${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}

async function loadHealthData() {
    if (window.location.protocol === 'file:') {
        return healthData;
    }

    try {
        const response = await fetch('./health_analysis.json');
        if (!response.ok) {
            throw new Error('Unable to load health data.');
        }

        return response.json();
    } catch (error) {
        console.warn('Falling back to bundled health data:', error);
        return healthData;
    }
}

async function searchCondition() {
    const input = document.getElementById('conditionInput').value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!input) {
        resultDiv.innerHTML = 'Please enter a health condition.';
        return;
    }

    try {
        const data = await loadHealthData();
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (!condition) {
            resultDiv.innerHTML = 'Condition not found.';
            return;
        }

        const symptoms = condition.symptoms.join(', ');
        const prevention = condition.prevention.join(', ');
        const imageSrc = condition.imagesrc.startsWith('http') || condition.imagesrc.startsWith('./')
            ? condition.imagesrc
            : `./${condition.imagesrc}`;

        resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
        resultDiv.innerHTML += `<img src="${imageSrc}" alt="${condition.name}" style="max-width: 220px;">`;
        resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
        resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
        resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${condition.treatment}</p>`;
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    }
}

addPatientButton.addEventListener('click', addPatient);
btnSearch.addEventListener('click', searchCondition);
