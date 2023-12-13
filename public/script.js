document.addEventListener("DOMContentLoaded", () => {
    const jsonURL = "https://aysanchez30.github.io/project/part5/about.json";

    const missionContentElement = document.getElementById("mission-content");
    const teamMembersElement = document.getElementById("team-members");

    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            missionContentElement.textContent = data["Mission Statement"]["content"];

            data["Team"].forEach(member => {
                const memberElement = document.createElement("div");
                const textContainer = document.createElement("div"); 
                const imageContainer = document.createElement("div");
                
                textContainer.innerHTML = `
                    <h2>${member.name}</h2>
                    <p>${member.description}</p>
                `;

                const imgElement = document.createElement("img");
                imgElement.src = member.img;
                imgElement.alt = member.name;

                memberElement.appendChild(textContainer);
                memberElement.appendChild(imgElement);

                teamMembersElement.appendChild(memberElement);
            });
        })
        .catch(error => {
            console.error("Error fetching or displaying JSON data:", error);
        });
        document.addEventListener('DOMContentLoaded', function() {
            const submitButton = document.getElementById('submitButton');
            const successMessage = document.getElementById('successMessage');
        
            submitButton.addEventListener('click', function() {
                successMessage.classList.remove('hidden');
        
                submitButton.disabled = true;
            });
        });

});
