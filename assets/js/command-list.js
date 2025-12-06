const command_holder = document.getElementById("commands");
const command_template = document.getElementById("command-template");

async function FetchCommands() {
  try {
    const data = await fetch("https://bot.shapes.lol/commands");
    const { Commands } = await data.json();

    // Check if 'Commands' is an object and not null
    if (typeof Commands !== 'object' || Commands === null) {
      throw new Error('The fetched data is not a valid object.');
    }

    // Iterate over the commands object
    commandsData = [];
    for (const cmdKey in Commands) {
      const cmd = Commands[cmdKey];  // Get the individual command object

      if (cmd.type === "slash_command") {
        cmd.type = "Slash";
        cmd.name = "/" + cmd.name;
      } else if (cmd.type === "context_menu_command") {
        cmd.type = "Menu";
        cmd.name = "Right Click User/Message To Use " + cmd.name;
      }

      console.log(cmd.name);
      console.log(cmd.description);

      commandsData.push(cmd);
    }

    updatePaginationControls();
    displayPage(currentPage);

  } catch (e) {
    console.error("Failed To Get Commands:", e);
  }
}

// just a copy from counting-lb.js with minor adjustments
let currentPage = 1;
let commandsData = [];
const itemsPerPage = 10;

function displayPage(page) {
    command_holder.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = commandsData.slice(startIndex, endIndex);

    pageData.forEach((cmd) => {
        const fragment = command_template.content.cloneNode(true);
        const card = fragment.querySelector('.command-card');
        if (card) {
            card.querySelector('.command-name').textContent = cmd.name || "Unknown";
            card.querySelector('.command-description').textContent = cmd.description || "";
            card.querySelector('.command-type').textContent = cmd.type || "Unknown Type";
        }
        command_holder.appendChild(fragment);
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(commandsData.length / itemsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updatePaginationControls();
        displayPage(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(commandsData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePaginationControls();
        displayPage(currentPage);
    }
});

FetchCommands();setInterval(FetchCommands,10000);
