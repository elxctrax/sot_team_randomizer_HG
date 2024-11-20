document.addEventListener("DOMContentLoaded", function() {
    //ship dropdown
    const shipTypeDropdown = document.querySelector(".dropdown:nth-of-type(1) .dropdown-toggle");
    const shipDropDownItems = document.querySelectorAll(".dropdown:nth-of-type(1) .dropdown-item");

    //role dropdown
    const roleDropdown = document.querySelector(".dropdown:nth-of-type(2) .dropdown-toggle");
    const roleDropDownItems = document.querySelectorAll(".dropdown:nth-of-type(2) .dropdown-item");

    //player name input
    const playerInput = document.querySelector(".form-control");

    //submit all the info
    const submitButton = document.querySelector(".btn-primary");

    //assemble teams btn
    const assembleTeamsButton = document.querySelector(".btn-success");

    //let players = [];
    let maxPlayers = 0;
    let maxRoles = {
        "Helm": 0,
        "Flex": 0,
        "Bilge": 0,
        "MC" : 0
    }
    let roleCounts = {
        "Helm": 0,
        "Flex": 0,
        "Bilge": 0,
        "MC" : 0
    }

    //dropdown btn display option when clicked
    shipDropDownItems.forEach(function (item) {
        item.addEventListener("click", function (event){
            event.preventDefault();
            shipTypeDropdown.textContent = item.textContent;

            if (item.textContent === "Gally") {
                maxPlayers = 8;
                maxRoles = { "Helm": 2, "Flex": 2, "Bilge": 2, "MC": 2 };
            }
            else if (item.textContent === "Brig") {
                maxPlayers = 6;
                maxRoles = { "Helm": 2, "Flex": 2, "MC": 2 };
            }
            else if (item.textContent === "Sloop") {
                maxPlayers = 4;
                maxRoles = { "Helm": 2, "MC": 2 };
            }

            roleCounts = {"Helm": 0, "Flex": 0, "Bilge": 0, "MC": 0};
            updateRoleDropdown(item.textContent);

        });

    });
    //role dropdown btn
    roleDropDownItems.forEach(function (item) {
        item.addEventListener("click", function (event){
            event.preventDefault();
            roleDropdown.textContent = item.textContent;
        });

    });
    //function to handle disabling roles for certain ship type
    function updateRoleDropdown(selectedShip) {
        roleDropDownItems.forEach(function (item) {
            const role = item.textContent.trim();
            
            if (selectedShip === "Brig" && role === "Bilge") {
                item.style.pointerEvents = "none";
                item.style.color = "red";
            }
            else if (selectedShip === "Sloop" && (role === "Flex" || role === "Bilge")) {
                item.style.pointerEvents = "none";
                item.style.color = "red";
            }
            else {
                item.style.pointerEvents = "auto";
                item.style.color = "";
            }
            //disable role if max reached
            if (roleCounts[role] > maxRoles[role]) {
                item.classList.add("disabled");
            }
            else {
                item.classList.remove("disabled");
            }

        })
    }

    submitButton.addEventListener("click", function () {
        const playerName = playerInput.value.trim();
        const selectedShip = shipTypeDropdown.textContent.trim();
        const selectedRole = roleDropdown.textContent.trim();

        if(!playerName){
            alert("Please Enter Player Name.");
            return;
        }

        if(selectedShip === "Ship Type"){
            alert("Please Select a Ship Type.");
            return;
        }

        if(selectedRole === "Role"){
            alert("Please Select a Role.");
            return;
        }

        if (roleCounts[selectedRole] >= maxRoles[selectedRole]) {
            alert(`${selectedRole} Role Has Been Exceeded.`);
            return;
        }

        const playerListTable = document.querySelector(".list-group");
        const currentPlayerCount = playerListTable.querySelectorAll(".list-group-item").length;

        if (currentPlayerCount > maxPlayers-1) {
            alert("Max Player Length Reached.");
            return;
        }

        const newListItem = document.createElement("li");
        newListItem.className = "list-group-item";
        newListItem.innerHTML = `${playerName} - ${selectedRole}`;
        playerListTable.appendChild(newListItem);

        roleCounts[selectedRole]++;
        updateRoleDropdown(selectedShip);

        playerInput.value = '';

    });

    assembleTeamsButton.addEventListener("click", function () {
        const players = Array.from(document.querySelectorAll(".list-group-item")).map(item => {
            const [name, role] = item.textContent.split(' - ');
            return { name: name.trim(), role: role.trim() };
        });

        if (players.length !== maxPlayers) {
            alert(`You Need ${maxPlayers} to Create Teams.`);
            return;
        }

        const teams = createTeams(players);

        if (!teams) {
            alert("Unable to Create Teams.");
        }

        updateTeamTables(teams);
    });

    function createTeams(players) {
        // Shuffle the players list to randomize the order
        const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    
        const teamA = [];
        const teamB = [];
        const rolesA = new Set();
        const rolesB = new Set();
    
        for (const player of shuffledPlayers) {
            const { name, role } = player;
    
            // Try to assign the player to a team while avoiding duplicate roles
            if (!rolesA.has(role) && teamA.length < players.length / 2) {
                teamA.push(player);
                rolesA.add(role);
            } else if (!rolesB.has(role) && teamB.length < players.length / 2) {
                teamB.push(player);
                rolesB.add(role);
            } else {
                // Unable to assign without breaking role constraints
                return null;
            }
        }
    
        // Final validation: Ensure both teams have players
        if (teamA.length === 0 || teamB.length === 0) {
            return null;
        }
    
        return { teamA, teamB };
    }    

    function updateTeamTables({ teamA, teamB}) {
        const teamATableBody = document.querySelector("table:nth-of-type(1) .table-group-divider");
        const teamBTableBody = document.querySelector("table:nth-of-type(2) .table-group-divider");

        teamATableBody.innerHTML = '';
        teamBTableBody.innerHTML = '';

        //actual display of teams on tblA
        teamA.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${player.name}</td>
                <td>${player.role}</td>
            `;
            teamATableBody.appendChild(row);
        });

        teamB.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${player.name}</td>
                <td>${player.role}</td>
            `;
            teamBTableBody.appendChild(row);
        });

    }

});