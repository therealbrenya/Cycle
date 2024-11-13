const dragCircle = document.getElementById("drag-circle");
const phaseName = document.getElementById("phase-name");
const currentDay = document.getElementById("current-day");
const todayDate = document.getElementById("today-date");

const circleContainer = document.querySelector(".chart-container");
const radius = circleContainer.offsetWidth / 2 - dragCircle.offsetWidth / 2;

const learnPhaseButton = document.getElementById("learn-phase");
const modal = document.getElementById("modal");
const modalPhaseName = document.getElementById("modal-phase-name");
const modalPhaseDetails = document.getElementById("modal-phase-details");
const closeButton = document.querySelector(".close-button");

// Set the cycle start date (e.g., 8 days ago)
const cycleStartDate = new Date();
cycleStartDate.setDate(cycleStartDate.getDate() - 7); // Assuming today is Day 8

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Detailed phases
const phases = [
    {
        name: "Menstrual Phase",
        details: `
            <b>What is it?</b> This is when your body is shedding the lining of your uterus (the part that would hold a baby if you were pregnant). You might notice bleeding during this time—it’s your body’s way of resetting.<br><br>
            <b>Why is it happening?</b> Your body didn't need the lining this month, so it’s letting it go.<br><br>
            <b>What will happen?</b> You might feel tired, have cramps, or feel a bit emotional. These are normal feelings during this phase.<br><br>
            <b>How to take care of yourself:</b> Rest when you’re tired, use a heating pad for cramps, and wear comfortable clothes. Try light stretches if you feel up to it.<br><br>
            <b>What to eat:</b> Foods rich in iron, like spinach, beans, and lentils, can help. Warm foods like soup can be comforting, too!
        `
    },
    {
        name: "Follicular Phase",
        details: `
            <b>What is it?</b> This is when your body starts preparing an egg in your ovary. It’s like your body is getting ready for a new cycle.<br><br>
            <b>Why is it happening?</b> Your body is naturally preparing for ovulation, the next step in your cycle.<br><br>
            <b>What will happen?</b> You might feel more energetic and creative during this time. It’s a great phase to start new projects or try fun activities.<br><br>
            <b>How to take care of yourself:</b> Take advantage of your energy by doing things you enjoy. Spend time outdoors, exercise, or explore creative hobbies.<br><br>
            <b>What to eat:</b> Fresh fruits, vegetables, and protein-rich foods like eggs, chicken, or tofu will keep you energized.
        `
    },
    {
        name: "Ovulation Phase",
        details: `
            <b>What is it?</b> This is when your body releases an egg from your ovary. It’s a big step in your cycle.<br><br>
            <b>Why is it happening?</b> Your body is ready for a possible pregnancy, but this doesn’t mean you’ll get pregnant unless sperm is present.<br><br>
            <b>What will happen?</b> You might feel an energy boost and feel more confident. Some people say they feel stronger during this phase.<br><br>
            <b>How to take care of yourself:</b> Take advantage of your energy by doing things that make you happy and active, like dancing or exercising.<br><br>
            <b>What to eat:</b> Foods with healthy fats, like avocado, nuts, and fish, help balance your hormones and keep you feeling good.
        `
    },
    {
        name: "Luteal Phase",
        details: `
            <b>What is it?</b> This is when your body prepares for your next period if you’re not pregnant. It’s the winding-down phase.<br><br>
            <b>Why is it happening?</b> Your body is getting ready for the next cycle, and hormone levels are changing.<br><br>
            <b>What will happen?</b> You might feel more tired, have cravings, or feel emotional (this is called PMS). It’s normal during this phase.<br><br>
            <b>How to take care of yourself:</b> Be kind to yourself. Get enough sleep, relax, and do things that calm you, like reading or taking a bath.<br><br>
            <b>What to eat:</b> Magnesium-rich foods like dark chocolate, leafy greens, and nuts can help ease PMS symptoms.
        `
    }
];

// Get phase based on the day
// Get phase based on the day
function getPhase(day) {
    if (day >= 1 && day <= 5) return phases[0]; // Menstrual: Day 1–5
    if (day >= 6 && day <= 13) return phases[1]; // Follicular: Day 6–13
    if (day === 14) return phases[2]; // Ovulation: Day 14
    return phases[3]; // Luteal: Day 15–28
}


// Update the date based on the selected day
function updateDate(day) {
    const currentDate = new Date(cycleStartDate);
    currentDate.setDate(cycleStartDate.getDate() + (day - 1)); // Add (day - 1) to the start date

    // Check if the currentDate is today
    const today = new Date();
    if (
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
    ) {
        todayDate.textContent = `Today, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`;
    } else {
        todayDate.textContent = `${dayNames[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`;
    }
}

// Update the phase and day
function updatePhase(day) {
    const phase = getPhase(day);
    phaseName.textContent = phase.name;
    modalPhaseName.textContent = phase.name;
    modalPhaseDetails.innerHTML = phase.details; // Use innerHTML for formatted content
    updateDate(day); // Update the date in the center circle
}

// Set draggable circle position based on angle
function setPosition(angle) {
    const centerX = circleContainer.offsetWidth / 2;
    const centerY = circleContainer.offsetHeight / 2;

    // Calculate draggable circle position based on the angle
    const x = centerX + radius * Math.cos(angle) - dragCircle.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - dragCircle.offsetHeight / 2;

    dragCircle.style.left = `${x}px`;
    dragCircle.style.top = `${y}px`;

    // Adjust angle-to-day mapping to align Day 1 at the top (angle = -π/2)
    const totalDays = 28;
    const normalizedAngle = (angle + Math.PI * 0.5 + 2 * Math.PI) % (2 * Math.PI); // Shift -π/2 to 0 and normalize
    const day = Math.ceil((normalizedAngle / (2 * Math.PI)) * totalDays) || 1; // Map normalized angle to days

    // Update day and phase
    currentDay.textContent = `Day ${day}`;
    updatePhase(day);
}


// Dragging functionality
let isDragging = false;
circleContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
});

window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = circleContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angle = Math.atan2(y, x);

    setPosition(angle);
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

// Modal functionality
learnPhaseButton.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Initialize default position
setPosition(-Math.PI / 2); // Start at the top of the circle (Day 8)

modal.style.display = "none"; // Ensure modal is hidden on load