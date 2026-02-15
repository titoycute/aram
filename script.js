// Latest DOH 2024 Regional Statistics Mock Data (since no municipal live API exists)
const regionalHIVStats = {
    "NCR": { risk: "Very High", notes: "Accounts for ~37% of new cases nationwide. Free PrEP available at LoveYourself, SHIPS, and public clinics." },
    "REGION IV-A": { risk: "High", notes: "Second highest region for new infections. High focus in urban hubs." },
    "REGION III": { risk: "High", notes: "Significant growth in 15-24 age demographic." },
    "REGION VII": { risk: "High", notes: "Concentrated cases in urban centers like Cebu City." },
    "DEFAULT": { risk: "Moderate", notes: "Cases are rising nationwide. Routine testing is recommended regardless of location." }
};

// 1. Initialize Charts
const ctx = document.getElementById('dailyTrendChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['2012', '2016', '2020', '2023', '2024'],
        datasets: [{
            label: 'Daily Reported Cases',
            data: [9, 22, 35, 46, 57],
            borderColor: '#dc2626',
            tension: 0.1
        }]
    }
});

// 2. Location Selector Logic (Buonzz API)
const regionSelect = document.getElementById('regionSelect');
const provinceSelect = document.getElementById('provinceSelect');
const citySelect = document.getElementById('citySelect');

async function loadRegions() {
    const res = await fetch('https://ph-locations-api.buonzz.com/v1/regions');
    const data = await res.json();
    data.data.forEach(reg => {
        let opt = new Option(reg.name, reg.id);
        opt.dataset.name = reg.name;
        regionSelect.add(opt);
    });
}

regionSelect.addEventListener('change', async () => {
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    provinceSelect.disabled = false;
    const res = await fetch(`https://ph-locations-api.buonzz.com/v1/regions/${regionSelect.value}/provinces`);
    const data = await res.json();
    data.data.forEach(p => provinceSelect.add(new Option(p.name, p.id)));
    showStatus(regionSelect.options[regionSelect.selectedIndex].dataset.name);
});

function showStatus(regionName) {
    const resDiv = document.getElementById('statusResult');
    const locName = document.getElementById('locationName');
    const locRisk = document.getElementById('locationRisk');
    
    resDiv.classList.remove('hidden');
    locName.innerText = regionName;
    
    const status = regionalHIVStats[regionName] || regionalHIVStats["DEFAULT"];
    locRisk.innerHTML = `<strong>Risk Status:</strong> ${status.risk}<br>${status.notes}`;
}

// 3. Simple AI Chatbot (Logic Placeholder)
const chatToggle = document.getElementById('chatbot-toggle');
const chatWindow = document.getElementById('chatbot-window');
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => chatWindow.classList.toggle('hidden'));

sendBtn.addEventListener('click', async () => {
    const msg = chatInput.value;
    if (!msg) return;
    
    appendMessage('You', msg);
    chatInput.value = '';
    
    // Simple Rule-based Logic for Offline accuracy
    // In production, connect this to OpenAI with a System Prompt
    const response = getAramResponse(msg);
    setTimeout(() => appendMessage('Aram', response), 500);
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    msgDiv.className = sender === 'You' ? 'text-right' : 'text-left bg-gray-100 p-2 rounded';
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAramResponse(input) {
    const text = input.toLowerCase();
    if (text.includes("symptoms")) return "Many people don't have symptoms. The only way to know is through a test.";
    if (text.includes("test")) return "You can get free, confidential tests at DOH hubs or centers like LoveYourself PH.";
    if (text.includes("cure")) return "There is no cure yet, but ART (Antiretroviral Therapy) allows PLHIV to live long, healthy lives.";
    return "I am the Aram AI, specifically trained for HIV awareness. For diagnosis, please visit the nearest health hub.";
}

loadRegions();